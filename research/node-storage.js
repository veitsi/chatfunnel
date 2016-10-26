var Storage = require('node-storage');
var store = new Storage('store.txt');
Storage.prototype.isEmpty=function(prop){
    return typeof(this.get(prop))==='undefined';
}
store.put('hello', {});
store.put('js', 'JavaScript');
store.put('hello.num', 'a55');
console.log(store.isEmpty('action'));
console.log(store.get('hello.num') );