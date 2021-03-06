# Atlas Monitor

### Contributing guideline

## Overview

Hello contributor! Thank you for your interest in our system :)
You can check out the documentation in the wiki section of this repository. Keep in mind, the information appears there
with a significant delay and not all. If you want to stay up to date with the latest news, read the source. We describe
all functions, components and classes at a high level, and it will not be difficult for you to figure out the details.

## Contributing rules

We have some rules to follow when writing code. Here they are:

* Describe all functions, components, classes, variables, etc. using typescript and JSDocs.
* Description in JSDocs must contain a detailed description, type decorators, for example, @function or @interface. Also
  write authorship after the @author decorator. We encourage writing examples after the @example decorator.
* Add copyright to the beginning of the file and indicate your authorship. Here is the copyright pattern:

```
Copyright (c) $today.year. This code created and belongs to Pathfinder render manager project. 
Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
File creator: $username
Project: $project.name
File last modified: $file.lastModified
All rights reserved.
```

* Name variables, functions and everything that you write as intuitively as possible so that there is no confusion and
  misunderstanding.
* Use CamelStyle in your code.
* If possible, link to documentation in JSDocs using @see.
* Name your commits this way: ```[module_name] (issue #issue_tag) Commit description.```.
* In the pull request, describe the changes in detail, write your credentials and add labels to the request. You can
  request a review from any of the reviewers.
* We are happy to put you outside collaborators if you can help us.
* Smile more often, we have a very friendly team :)

## Code convention

* Add copyright to the beginning of the file and indicate your authorship. Here is the copyright pattern.

    ```
    Copyright (c) $today.year. This code created and belongs to Pathfinder render manager project. 
    Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
    Project: $project.name
    File last modified: $file.lastModified
    All rights reserved.
    ```

* Keep spacing in the code:
    - Keep one linebreak spacing between copyright and imports block.
    - Keep two linebreaks spacing between imports and code blocks.
    - Keep one linebreak spacing between functions, classes, etc.
    - Keep one linebreak spacing between logic blocks in code.

* Keep code file structure using this order:
    - Copyright.
    - Imports.
    - Other code:
    - Namespaces and classes.
    - Functions.

* In __functions__, __methods__, __classes__, __interfaces__ create ```@author``` tag and fill it with your name.
* Keep classes structure in this order:
    * Static fields.
    * Non-static fields.
    * Constructor.
    * Static methods.
    * Non-static methods.
  > Namespaces, declarations and interfaces have to be higher in code than realisation.

* Use CamelStyle in your code. Components, interfaces started with capital letter. Functions, variables started with
  lower letter. Name variables, functions and everything that you write as intuitively as possible so that there is no
  confusion and misunderstanding.

    ```typescript
    interface Interface {
    }
    
    const Component = React.forwardRef((props: Interface, ref: Ref) => {
    });
    
    function func() {
    }
    
    let variable;
    ```

* Place ```Options``` interfaces into a __holder namespace__.
    ```typescript
    declare namespace Foo {
        /**
         * Options - interface for Foo options.
         * @interface
         * @author Danil Andreev
         */
        export interface Options {
            /**
             * bar - just example field name.
             */
            bar?: string;
            /**
             * baz - another example field name.
             */
            baz?: number; 
        }
    }
    
    /**
     * Foo - example class.
     * @class
     * @author Danil Andreev
     */
    class Foo { 
        /**
         * text - example text string.
         */
        protected static text: string = "Hello world";
    
        /**
         * constructor - creates an instance of Foo.
         * @constructor
         */
        public constructor(options?: Options) {
            // ...
        }
    
        /**
         * sayHello - method, designed to print text from input variable 
         * or static calss variable if input is not defined.
         * @method
         * @param text - Input text for printing.
         * @author Danil Andreev
         */
        public sayHello(text?: string): void {
            console.log(text || Foo.text);
        }
    }
    
    export default Foo;
    ```

* Components must use ```React.forwardRef()```.
* All functions, interfaces and components must have JSDocs. Description in JSDocs must contain a detailed description,
  type decorators, for example, @function or @interface. Also write authorship after the @author decorator. We encourage
  writing examples after the @example decorator.

    ```typescript
    /**
     * functionName - function that do something
     * @function
     * @author Name Surname
     */
    ```

* Specify types for all components.
    ```typescript
    const foo: string = "Hello darkness my old friend";
    
    function bar(input: string): string {
        return "Atlas: " + input; 
    }
    
    const baz = (input: string): string => "Atlas: " + input;
    ``` 
* Use __ES6__ _(ECMAScript 6)_ style in your code.

* Functions that works events or states must start with ```handle```.

    ```typescript
    const handleFunction = () => {
    }
    ```

* To apply styles to components use HOC ```withStyles```.

    ```typescript
    withStyles(styles)(YourComponent);
    ```

* Use double-quoted strings.

    ```typescript
    import * as _ from "lodash";
    import Server from "./Server";
    
    
    const text: string = "Hello";
    console.log("Hello darkness");
    ```

* If you have lots of props in a component field write each prop from new line.

    ```tsx
    return(
        <Component
            color="white"
            text="text"
            onClick={handleClick}
        />
    );
    ```

* Use PropTypes after component body.

    ```typescript
    Component.displayName = "Component";
    Component.propTypes = {
        text: PropTypes.string
    };
    ```

* Component example:
    - Every component must have namespace with Props, Classes and other interfaces that belongs to this component.
    - Variable that uses ```React.forwardRef()``` must have name ```Comp```.
    - After ```Comp``` create variable with a component name, then assign ```withStyles()``` and other HOCs.
  
  ```tsx
  import React, {useEffect, useState} from "react";
  import {Box, Button, Typography, withStyles} from "@material-ui/core";
  import styles from "./styles";
  import PropTypes from "prop-types";
  import Stylable from "../Stylable";
  
  
  /**
   * TestComponent - namespace for TestComponent component.
   * @namespace
   * @author Andrii Demchyshyn
   */
  declare namespace TestComponent {
      /**
       * Props - interface for TestComponent component.
       * @interface
       * @author Andrii Demchyshyn
       */
      export interface Props extends Stylable<Classes> {
          /**
           * text - component name.
           */
          text: string;
      }
  
      /**
       * Classes - interface for TestComponent styles.
       * @interface
       * @author Andrii Demchyshyn
       */
      export interface Classes {
          /**
           * root - styles applied to the root component
           */
          root?: string;
          /**
           * title - styles applied to the title component
           */
          title?: string;
          /**
           * button - styles applied to the button component
           */
          button?: string;
      }
  }
  
  /**
   * TestComponent - component that display field with text.
   * @function
   * @author Andrii Demchyshyn
   */
  const Comp = React.forwardRef((props: TestComponent.Props, ref: React.Ref<HTMLSpanElement>) => {
      const {
          text,
          classes,
          className,
      } = props;
  
      const [number, setNumber] = useState<number>(0);
  
      useEffect(() => {
          if (number > 10) {
              setNumber(0);
          }
      }, [number]);
  
      /**
       * handleIncreaseNumber - function increases number by 1.
       * @function
       * @author Andrii Demchyshyn
       */
      function handleIncreaseNumber(): void {
          setNumber(number + 1);
      }
  
      return (
          <Box>
              <Typography ref={ref} className={classes?.root}>
                  {text}
              </Typography>
              <Typography className={classes?.title}>
                  Button clicked {number} times
              </Typography>
              <Button
                  className={classes?.button}
                  onClick={handleIncreaseNumber}
              >
                  Click
              </Button>
          </Box>
      );
  });
  
  Comp.displayName = "TestComponent";
  
  Comp.propTypes = {
      text: PropTypes.string.isRequired
  };
  
  const TestComponent = withStyles(styles)(Comp);
  
  export default TestComponent;
  ```

## Contacts

You can send your questions to this email: danssg08@gmail.com

## Good luck

Thank you for reading this guide. Good luck!
