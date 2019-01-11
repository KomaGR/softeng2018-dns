# Contributing

The project uses the [Feature Branch Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow). This is experimental and is expected to speed up development in comparison with the Gitflow Workflow. Some key associations to make with the Feature Branch Workflow are:

- focused on branching patterns.
- can be leveraged by other repo oriented workflows.
- promotes collaboration with team members through pull requests and merge reviews.

## Workflow

In general (and as stated in the Feature Branch Workflow) when you want to implement something on the project:

0. Think about what you want to do.
1. Sync with the github repository.
2. Checkout the feature branch. Create it if it does not exist and make sure it exists on github. 
3. Checkout a branch for the specific part you are going to work on. This part can be skipped, albeit with risks, when you are the sole developer of the feature.
4. Code.
5. Test. Jump to 4 accordingly.
6. When finished, push your code.
7. Create a pull request with a short but concise description.
8. Participate in discussion between the team members on whether the feature needs improvements or should be merged.
9. Jump to 1.

## Guidelines

Here is a short list of guidelines (adapted from [TypeScript Coding Guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines)). This is not an exhaustive guide, so please be willing to make requested modifications to your code.

### General
* Open pull requests against the `<feature>` branch.
* When appropriate, encapsulate your code in its own class, in its own file.

### Names

* Use lowercase and separate words with an underscore for branch names.
* Use lowercase for directories (do not capitalize first), unless it's a class specific.
* Use PascalCase for class file names (otherwise preferably lowercase).
* Use whole words, not abbreviations, in names.
* Use PascalCase for type names and public methods.
* Use camelCase for local variables and private properties.

### Commits

* Use only English in commit messages.
* Use present tense (e.g. "Fix error" and not "Fixed error").
* Use imperative. "Fix", "Add", "Change" instead of "Fixes", "Adds", "Changes".
* Don't end the summary line with a period.

## Further Instructions

If any of nodemon, typescript and ts-node is not available on the system, install it with 
```
$ npm install --global typescript ts-node nodemon
```

*Note: Look up the difference between --save, --save-dev and --global options in npm to make sure any modules you include are imported correctly into the project.*

Because the gruntfile* is not yet ready, when you make changes in the code you have to run build again ( `npm run build` ). 

**When the grunt job is deployed, any change you make to .ts files will wake a build script that will do the above automatically for you.*