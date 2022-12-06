# Liszt Programming Language

Programming language that seeks to incorporate the best aspects of both functional and object oriented programming

This repo may end up being a prototype as I'm experimenting with bidirectional type checking.

Written with TypeScript v4.8.4.

## Basic Concepts

Liszt is a gradually typed language with bidirectional type checking, which means type annotations can be omitted and many types will still be inferred from the expressions. The one place where type annotations are really useful is function parameters and sometimes the function return type, but if you omit these your program will still work (albeit without static type checking).

Liszt is object-oriented with prototypes, but also has first-class functions and other functional programming features.

The syntax is inspired by Ruby and Python. The type system is inspired by TypeScript.

Liszt compiles to JavaScript, so it can be used both for browser-based applications and on the server via Node.js.

## Credits

The type checker implementation owes a great deal to Jake Donham's [Reconstructing TypeScript](https://jaked.org/blog/2021-09-07-Reconstructing-TypeScript-part-0) series.

## The language

Comments start with a semicolon and continue to the end of the line.

### Literals

There are literals for Integer, Float, String, Boolean, Symbol, Object, Tuple, Vector, and Nil types.

```ruby
17
3.14
"hello, world"
true
:thisIsASymbol
{ type: "Person", name: "Jason", age: 42 }
(1, false, "hello", { value: 42 })
vec[1, 2, 3]
nil
```

Note that both Integer and Float are subtypes of Number, so they can be mixed together in most operations (need to fix this).

### Declaring bindings

Declare variables with `var` and constants with `const`. Note that if you reassign a variable the new value must be of the same type as the one it was declared with.

```ruby
var changeMe = "I can be changed!"
const cantChangeMe = "Try to change me and it will throw an error"

cantChangeMe = 42 ;=> Type error!
```

### Defining functions

Define functions with the `def` keyword and end the body with `end`. Note that we strongly recommend using type annotations with the function parameters, though a return type annotation is not necessary. If you don't annotate the function parameters, they will be typed as Any which basically turns off the type checker.

```ruby
def inc(x: integer)
    x + 1
end
```

If you want to annotate the return type you can do that too; sometimes it's a big help to the type checker (especially with recursive functions).

Note that the if operation is an expression, not a statement, and it MUST have an else branch.

```ruby
def fib(n: integer): integer
    if n == 0
        1
    else
        n * fib(n - 1)
end
```

You can also just assign a lambda to a variable (though a lambda must use an explicit block if you want its body to include more than a single expression). Note the function type annotation - it's not necessary, but it does help the type checker out! When there's no function type annotation, function parameters that are not individually annotated get typed as Any.

```ruby
const inc: (x: integer) => integer = (x) => x + 1
```

### Generic functions

You can use type variables in your function definitions for parametric polymorphism. Type variables start with a single quote character.

```ruby
def id(x: 'a)
    x
end
```

### Iteration

Iterate over vectors with for statements.

```ruby
var sum = 0

for n in vec[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  sum = n + 1
end

sum == 55  ;=> true
```

### Constants are really constant

In JavaScript, you can reassign properties of an object (or indices of an array) even if the object is declared with `const`, like so:

```js
const obj = { greeting: "Hello" };
obj.greeting = "Hi!";

const arr = [1, 2, 3];
arr[2] = 5;
```

Trying to do that with a Liszt object or vector will cause a type error at compile time, so this

```ruby
const obj = { greeting: "Hello" };
obj.greeting = "Hi!"
```

or this

```ruby
const v = vec[1, 2, 3]
v[2] = 5
```

will throw an error. You can always reassign properties or indices of objects that are declared with `var` though.

### Creating types

You can also create your own types as aliases for built-in types, tuple types, and object types.

```ruby
; Object type
type Point = { x: number, y: number }

; Intersection type
type Point3D = Point & { z: number }

; Union type
type Coordinate =
    { type: "Cartesian", x: number, y: number }
  | { type: "Polar", angle: number, magnitude: number }

; Function type
type Adder = (x: number) => number

; Curried function type
type AdderMaker = (x: number) => (y: number) => number

; Tuple type
type Coord = (number, number)
```

You can also use type variables to create generic types, with no concrete type annotations needed.

```ruby
type Box = { value: 'a }
var boxedNum: Box = { value: 5 }
```

Note that types are structural, not nominal, so an unannotated object with all the same property types as a defined type will check properly for that type.
