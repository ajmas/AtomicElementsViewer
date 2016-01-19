// Node JS based Script

'use strict'

var express = require('express');
var fs = require('fs');
var console = require('console');
var app     = express();

var elementDataFile = '../../../AtomicElements/data/elements.txt';
var elementNamesDataFile = '../../../AtomicElements/data/element_names_multilingual.txt';
var outputFile = '../js/elements.js';
var elementNameLang = 'en';

function convert() {

     var fieldNames = [];
     var fieldOffsetByName = { };

     var elements = [];
     var elementByNumber = {};
     var lineIdx = -1;

     fs.readFileSync(elementDataFile).toString().split('\n').forEach(function (line) {
          var fields = [], element, i;

          lineIdx++;

          fields = line.split('\t');

          // Handle header line
          if (lineIdx === 0) {
              fieldNames = fields;
              for (i=0; i<fields.length; i++) {
                  fieldOffsetByName[fields[i]] = i;
              }
          } else {
              element = { };

              for (i=0; i<fields.length; i++) {
                   if (fieldNames[i].trim().length > 0) {
                       element[fieldNames[i]] = fields[i];
                   }
              }

              elements.push(fields);

              elementByNumber[element['atomic_number']] = element;

          }
     });

     lineIdx = -1;

     fs.readFileSync(elementNamesDataFile).toString().split('\n').forEach(function (line) {
          var fields = [], element, i, atomicNumber;

          lineIdx++;

          fields = line.split('\t');

          // Handle header line
          if (lineIdx === 0) {
              fieldNames = fields;
              for (i=0; i<fields.length; i++) {
                  fieldOffsetByName[fields[i]] = i;
              }
          } else {
              atomicNumber = fields[fieldOffsetByName['atomic_number']];
              if (atomicNumber) {
                  elementByNumber[atomicNumber].name = fields[fieldOffsetByName[elementNameLang]];
              }
          }
     });

     console.log(JSON.stringify(elementByNumber,undefined,'  '));
}

convert();