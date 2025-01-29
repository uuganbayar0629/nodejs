// const { EventEmitter } = require('events');
// const eventEmitter = new EventEmitter();

// eventEmitter.on('go', (params) => {
//     console.log(`go ${params}`);
// });

// eventEmitter.emit('go', 'slow');
// eventEmitter.emit('go', 'fast');



//find odd or even
// findOddEven();
// findMiddleValue([1, 3, 4, 6, 5, 5, 6]);
findDuplicatedText("Uuganbayar");

function findOddEven() {
    let arr = [ 1, 3, 4, 6, 5];
    for(item of arr){
        console.log(`number ${item} is ${item%2 === 0 ? 'even' : 'odd'}`)
    }
  }

function findMiddleValue(arr = []){

    if(arr.length <= 2){
        console.log('dont have middle value');
        return;
    }

    //is even
    if(arr % 2 == 0){
        console.log('dont have middle value because array is even');
        return;
    }

    let middleIndex = (arr.length - 1) / 2;
    console.log(`middle index : ${middleIndex}`);
    console.log(`middle value id : ${arr[middleIndex]}`);
}



function findDuplicatedText(str){

    const charArray = str.split('');

    let characterCount = [];

    for(item of charArray){
        if(characterCount.filter(it => it.val == item).length > 0){
            characterCount.filter(it => it.val == item).forEach(it => it.count += 1);
        } else {
            characterCount.push({ count: 1, val : item })
        }
    }
    characterCount.filter(it => it.count > 1).forEach(it => {
        console.log(`duplicate value : ${it.val} and duplicate count : ${it.count}`)
    });

}


  

