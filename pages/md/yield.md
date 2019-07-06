# JS探秘：yield表达式解析
在基础实验二中，有一道题的要求是实现一个迭代器，可以对树进行先序遍历。

为了完成这道题，本人使用到了JavaScript的一个特性——yield表达式。在完成这道题后，本人感受到了yield表达式提供的强大而灵活的功能，所以专门写了这篇技术博客来讨论yield关键字。

---

## 生成器（generator）对象和yield关键字
一般来说，yield关键字经常和生成器对象配套使用。为此，我们先学习一下生成器对象。

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
上述代码片段实现了一个无限迭代器，其中fucntion* idMaker(){...}是一个生成器函数
