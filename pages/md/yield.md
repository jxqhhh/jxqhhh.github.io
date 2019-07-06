# JS探秘：yield表达式解析
在基础实验二中，有一道题的要求是实现一个迭代器，可以对树进行先序遍历。

为了完成这道题，本人使用到了JavaScript的一个特性——yield表达式。在完成这道题后，本人感受到了yield表达式提供的强大而灵活的功能，所以专门写了这篇技术博客来讨论yield关键字。

---

## 生成器（generator）对象和yield关键字
一般来说，yield关键字经常和生成器对象配套使用。为此，我们先学习一下生成器对象。所谓生成器对象是由一个 generator function 返回的,并且它符合可迭代协议和迭代器协议。

首先，我们观察如下代码片段：
```
function* idMaker(){
    let index = 0;
    while(true)
        yield index++;
}

let gen = idMaker(); // "Generator { }"

console.log(gen.next().value); 
// 0
console.log(gen.next().value); 
// 1
console.log(gen.next().value); 
// 2
// ...
```
上述代码片段实现了一个无限迭代器，其中fucntion* idMaker(){...}是一个生成器函数，而gen则是一个相应的生成器对象。

对于生成器函数，一个常用的方法是Generator.prototype.next()，该方法会执行生成器函数中尚未执行的代码，直到执行到一个yield关键字后返回yield表达式产生的值并暂停执行，并且在下次调用Generator.prototype.next()时继续执行上次调用next()时产生返回值的yield表达式之后的代码。

如果某次调用Generator.prototype.next()方法后，即使执行完了所有的未执行代码也没有执行一次yield表达式，next()方法的返回值就会变为{value: undefined, done: true}这样一个object。

---

## yield*表达式

yield* 表达式用于委托给另一个generator 或可迭代对象。具体来说,yield*具有如下属性：

 * yield* 表达式迭代操作数，并产生它返回的每个值。
 * yield* 表达式本身的值是当迭代器关闭时返回的值（即done为true时）。

为了更加具体地展现yield*表达式的作用，我们从以下三方面举例说明：

##### 1.委托给其他生成器
```
function* g1() {
  yield 2;
  yield 3;
  yield 4;
}

function* g2() {
  yield 1;
  yield* g1();
  yield 5;
}

var iterator = g2();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: 4, done: false }
console.log(iterator.next()); // { value: 5, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```
在上述代码中，yield*委托了生成器对象g1()。

##### 2. 委托给其他可迭代对象
```function* g3() {
  yield* [1, 2];
  yield* "34";
  yield* arguments;
}

var iterator = g3(5, 6);

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: "3", done: false }
console.log(iterator.next()); // { value: "4", done: false }
console.log(iterator.next()); // { value: 5, done: false }
console.log(iterator.next()); // { value: 6, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```
在上述代码中，yield*依次委托了[1,2]、"34"、arguments这些可迭代对象。

##### 3. yield* 表达式的值
```
function* g4() {
  yield* [1, 2, 3];
  return "foo";
}

var result;

function* g5() {
  result = yield* g4();
}

var iterator = g5();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }, 
                              // 此时 g4() 返回了 { value: "foo", done: true }

console.log(result);          // "foo"
```
在上述代码中，yield*表达式的值等于它委托的g4()的返回值"foo"，并且"foo"被赋给了result对象。





