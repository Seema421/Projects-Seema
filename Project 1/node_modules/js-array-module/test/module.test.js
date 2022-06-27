var expect = require('expect');
var server = require('../server');

describe('Array Sum', () => {
    it('should exist', () => {
        var arr = [1];
        var arraySum = server.SumArray(arr);
        
        expect(arraySum).toExist();
    });
    
    it('should return a number', () => {
        var array = [1,2,3,4,5];
        var arraySum = server.SumArray(array);
        
        expect(arraySum).toBeA('number');
    });
    
    it('should return the value of the array', () => {
        var array = [1,2,3,4,5];
        var arraySum = server.SumArray(array);
        
        expect(arraySum).toBe(15);
    });
});

describe('Average Array', () => {
    it('should return the average value of the array', () => {
        var array = [1,2,3,4];
        var arr = server.AverageArray(array);
        
        expect(arr).toBe(2.5);
    });
});

describe('Max Array', () => {
    it('should return the maximum value of the array', () => {
        var array = [1,2,3,4];
        var arrayMax = server.MaxArray(array);
        
        expect(arrayMax).toBe(4);
    });
});

describe('Min Array', () => {
    it('should return the minimum value of the array', () => {
        var array = [1,2,3,4];
        var arrayMax = server.MinArray(array);
        
        expect(arrayMax).toBe(1);
    });
});

describe('Uniq Array', () => {
    it('should return a uniq array', () => {
        var arr = [2, 2, 7, 3, 4, 3, 6, 8, 5, 9, 8];
        var uniq = server.UniqArray(arr);
        var result = [2, 7, 3, 4, 6, 8, 5, 9];
        
        expect(uniq).toEqual(result);
    })
});

describe('Uniq Array Sort', () => {
    it('should return a uniq sorted array', () => {
        var arr = [2, 2, 7, 3, 4, 3, 6, 8, 5, 9, 8, 1];
        var uniqSort = server.UniqArraySort(arr);
        var result = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        
        expect(uniqSort).toEqual(result);
    });
});

describe('Uniq String Array', () => {
    it('should return a uniq sorted string array', () => {
        var arr = ["Zoo", "Add", "Node", "Add", "Node"];
        var uniqString = server.UniqStringArray(arr);
        var result = ["Add", "Node", "Zoo"];
        
        expect(uniqString).toEqual(result);
    });
});








