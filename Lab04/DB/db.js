const util = require('util');
const events = require('events');

let dbData = [
    {
        id: 1,
        name: 'Kristina Shkoda',
        bday: '2003-01-15'
    },
    {
        id: 2,
        name: 'Vasilisa Kashperko',
        bday: '2001-12-21'
    },
    {
        id: 3,
        name: 'Victoria Shahlai',
        bday: '2001-01-20'
    }
];

function DB() {
	this.getIndex = () => { return dbData.length; };
    this.getLastId = () => {return dbData[dbData.length - 1].id}
    this.select = () => { return dbData; };
    this.selectById =(id)=>{
        const elem = dbData.find(item => item.id === id)
        return elem 
    };
    this.insert = row => { dbData.push(row); };
    this.update = row => {
        let indexOfObj = dbData.findIndex(item => item.id == row.id);
        return dbData.splice(indexOfObj, 1, row);
      }

    this.delete = id => {
		console.log(id);
	    let delIndex = dbData.findIndex(element => element.id === id);
		console.log(delIndex);
	    if(delIndex !== -1) {
	        return dbData.splice(delIndex, 1);
	    }
	    else {
	    	return JSON.parse('{"error": "no index"}');
		}
    };
}

util.inherits(DB, events.EventEmitter);
exports.DB = DB;