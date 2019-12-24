const through2 = require('through2');
const fs = require('fs');
const split = require('split2');

const parseCSV = () => {
    let templateKeys = [];
    let parseHeadline = true;

    // Мы создаем трансформатор для объектного потока.Обратите
    // внимание на метод.obj.Даже если ваши входные данные - это
    // просто строки, вам нужен трансформатор объектного потока, если
    // вы хотите продолжать выпускать объекты.
    return through2.obj((data, enc, cb) => {

        // В этом блоке мы парсим направляющую строку(разбитую на
        // запятые).Это будет наш шаблон для ключей.Мы удаляем эту
        // строку из потока, поэтому передаем null оба раза.
        if (parseHeadline) {
            templateKeys = data.toString().split(',');
            parseHeadline = false;
            return cb(null, null);
        }

        const entries = data.toString().split(',');
        const obj = {};

        // Для всех остальных строк каждый объект мы создаем с помощью
        // шаблона ключей, который мы распарсили ранее.
        templateKeys.forEach((item, index) => {
            obj[item] = entries[index];
        });

        // Мы передаем этот объект на следующий этап.
        return cb(null, obj);
    });
};

const pickFirst10 = () => {
    let cnt = 0;
    return through2.obj((data, enc, cb) => {
        if (cnt++ < 10) {
            return cb(null, data);
        }
        return cb(null, null);
    });
};

const toJSON = () => {
    const objs = [];
    return through2.obj(function (data, enc, cb) {

        // Мы собираем все проходящие данные в массив и удаляем объекты
        // из нашего потока.
        objs.push(data);
        
        // Во второй функции обратного вызова, метод flush, мы
        // преобразуем собранные данные в строку JSON. С помощью
        // this.push мы помещаем этот новый объект в следующий этап
        // нашего потока. В этом примере новый «объект» - просто строка -
        // что-то, что совместимо с обычными записываемыми
        // потоками!
        cb(null, null);
    }, function(cb) {
        this.push(JSON.stringify(objs));
        cb();
    });
};

const stream = fs.createReadStream('sample.csv');

stream
    .pipe(split())
    .pipe(parseCSV())
    .pipe(pickFirst10())
    .pipe(toJSON())
    .pipe(process.stdout);

// const server = http.createServer((req, res) => {
//     stream.pipe(res);
// });

// server.listen(8000);