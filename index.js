var parsedAMD = {};
var fileType;
var originalFile;
var content;
var encode = 'utf8';
var defaults = {
    overwrite: true
};

var AMD_REGEXP  = /((?:^define|[\s\S]*[\s,;\{\})]define)\s*\()\s*(?:['"](.*?)['"])?\s*,?\s*(?:\[([\s\S]*?)\]\s*,)?\s*(?:function\s*\((.*?)\))?\s*([\s\S]*)/;
var DEPS_REGEXP = /[^'",\s]+/g;

function extend(){
    for(var i = 1; i < arguments.length; i++)
        for(var k in arguments[i])
            if(arguments[i].hasOwnProperty(k))
                arguments[0][k] = arguments[i][k];
    return arguments[0];
}

function compile(parsedAMD) {
    var startPart        = parsedAMD.start;
    var namePart         = parsedAMD.name ? "'" + parsedAMD.name + "', " : "";
    var dependenciesPart = parsedAMD.dependencies.length ? "['" + parsedAMD.dependencies.join("', '") + "'], " : "[], ";
    var functionPart     = parsedAMD.arguments ? "function(" + parsedAMD.arguments.join(", ") + ") " : "";
    var endPart          = parsedAMD.end;

    return startPart + namePart + dependenciesPart + functionPart + endPart;
}

function toString(parsedAMD) {
    return compile(parsedAMD);
}

function toBuffer(parsedAMD) {
    return new Buffer(compile(parsedAMD), encode);
}

function toVinyl(parsedAMD) {
    originalFile.contents = toBuffer(parsedAMD);
    return originalFile;
}

module.exports.parse = function(file, enc) {
    originalFile = file;
    encode = enc || encode;

    if (typeof file === 'string') {
        fileType = 'string';
        content = file;
    }

    if (Buffer.isBuffer(file)) {
        fileType = 'buffer';
        content =  file.toString(encode);
    }

    if (typeof file === 'object' && Buffer.isBuffer(file.contents)) {
        fileType = 'vinyl';
        content =  file.contents.toString(encode);
    }

    if (!fileType) {
        throw 'file type is undefined';
    }

    var matches = content.match(AMD_REGEXP);
    parsedAMD.start        = matches[1];
    parsedAMD.name         = matches[2];
    parsedAMD.dependencies = matches[3] ? matches[3].match(DEPS_REGEXP) : [];
    parsedAMD.arguments    = matches[4] !== undefined ? (matches[4] ? matches[4].match(DEPS_REGEXP) : []) : undefined;
    parsedAMD.end          = matches[5];

    return this;
};

module.exports.get = function(field) {
    return field ? parsedAMD[field] : parsedAMD;
};

module.exports.setName = function(name, options) {
    options = extend({}, defaults, options);

    parsedAMD.name = parsedAMD.name && !options.overwrite ? parsedAMD.name : name;

    return this;
};

module.exports.clearName = function(name) {
    delete parsedAMD.name;

    return this;
};

module.exports.add = function(dependencies) {
    dependencies = dependencies ? (typeof dependencies === 'string' ? [dependencies] : dependencies) : [];

    parsedAMD.dependencies = parsedAMD.dependencies.concat(dependencies);

    return this;
};

module.exports.remove = function(dependencies) {
    dependencies = dependencies ? (dependencies instanceof Array ? dependencies : [dependencies]) : [];

    for (var i = 0; i < parsedAMD.dependencies.length; i++) {
        for (var j = 0; j < dependencies.length; j++) {
            if (parsedAMD.dependencies[i] === dependencies[j]) {
                parsedAMD.dependencies.splice(i, 1);
                i--;
            }
        }
    }

    return this;
};

module.exports.clear = function() {
    parsedAMD.dependencies.length = 0;

    return this;
};

module.exports.save = function() {
    var result;

    switch (fileType) {
        case 'string': result = toString(parsedAMD);
            break;
        case 'buffer': result = toBuffer(parsedAMD);
            break;
        case 'vinyl':  result = toVinyl(parsedAMD);
            break;
    }

    return result;
};

module.exports.toString = toString;

module.exports.toBuffer = toBuffer;

module.exports.toVinyl = toVinyl;