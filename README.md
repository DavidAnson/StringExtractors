# StringExtractors

A collection of simple command-line utilities to extract strings and comments from source code in various languages. Results are written to standard output where they can be redirected to a file and (for example) spell-checked with a word processor. Wildcards are supported; errors abort the process.


## [C#](http://en.wikipedia.org/wiki/C_Sharp_%28programming_language%29): CSharpStringExtractor

Runs on [.NET](http://www.microsoft.com/net).
Dependencies via [NuGet](http://www.nuget.org/).
[Roslyn](http://msdn.microsoft.com/en-us/library/roslyn.aspx) for parsing.
Wildcard matching includes subdirectories.

```
C:\StringExtractors\CSharpStringExtractor>NuGet restore -SolutionDirectory .
Installing 'Microsoft.Bcl.Metadata 1.0.9-alpha'...

C:\StringExtractors\CSharpStringExtractor>MSBuild
Build succeeded...

C:\StringExtractors\CSharpStringExtractor>bin\Debug\CSharpStringExtractor *.cs
[Extracted strings and comments]
```


## [JavaScript](http://en.wikipedia.org/wiki/JavaScript): JavaScriptStringExtractor

Runs on [Node.js](http://nodejs.org/).
Dependencies via [npm](https://www.npmjs.org/).
[Esprima](http://esprima.org/) for parsing and [glob](https://github.com/isaacs/node-glob) for globbing.
Wildcard matching includes subdirectories when `**` is used.

```
C:\StringExtractors\JavaScriptStringExtractor>npm install
npm http GET https://registry.npmjs.org/esprima...

C:\StringExtractors\JavaScriptStringExtractor>node JavaScriptStringExtractor.js *.js
[Extracted strings and comments]
```


## License

[MIT](LICENSE)
