using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

/// <summary>
/// Extracts all strings/comments from C# source code.
/// </summary>
class CSharpStringExtractor
{
    // Supported comment kinds
    private static readonly SyntaxKind[] CommentSyntaxKinds = new SyntaxKind[]
    {
        SyntaxKind.SingleLineCommentTrivia,
        SyntaxKind.SingleLineDocumentationCommentTrivia,
    };

    // Regular expression for removing tags from XML comments (ex: "<summary>")
    private static readonly Regex XmlElementRegex = new Regex("<[^>]*>");

    /// <summary>
    /// Entry point for the program.
    /// </summary>
    /// <param name="args">Command-line arguments.</param>
    private static void Main(string[] args)
    {
        try
        {
            // For each argument...
            foreach (var arg in args)
            {
                // Perform simple glob-ing to support "*.cs"
                var directoryName = Path.GetDirectoryName(arg);
                if (string.IsNullOrEmpty(directoryName))
                {
                    directoryName = ".";
                }
                foreach (var file in Directory.EnumerateFiles(directoryName, Path.GetFileName(arg), SearchOption.AllDirectories))
                {
                    // Parse file
                    var syntaxRoot = CSharpSyntaxTree.ParseFile(file).GetRoot();

                    // Strings
                    foreach (var text in
                        syntaxRoot
                            .DescendantNodes()
                            .Where(n => n.IsKind(SyntaxKind.StringLiteralExpression))
                            .Cast<LiteralExpressionSyntax>()
                            .Select(s => s.Token.ValueText))
                    {
                        Console.WriteLine(text);
                    }

                    // Comments
                    foreach (var line in
                        syntaxRoot
                            .DescendantTrivia()
                            .Where(n => CommentSyntaxKinds.Contains(n.CSharpKind()))
                            .SelectMany(n =>
                                n
                                    .ToFullString()
                                    .Split('\n')
                                    .Select(l => XmlElementRegex.Replace(l, ""))
                                    .Select(l => l.Trim(' ', '/'))
                                    .Where(l => !string.IsNullOrWhiteSpace(l))))
                    {
                        Console.WriteLine(line);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            // Output details
            Console.Error.WriteLine(ex);
        }
    }
}
