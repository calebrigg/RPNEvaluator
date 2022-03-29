// Developed with Node v16.13.1
// Reference: Removal of unnecessary parenthesis (StackOverflow User: pokey909 - https://stackoverflow.com/questions/13204483/remove-extra-parenthesis)
const readline = require('readline');
const f = require('fs');

// Evaluates whether or not a given character is a valid operator
function isOperator(item) {
    return (item == '+' || item == '-' || item == '*' || item == '/');
}

// Helper function to orient results from two main functions properly
function processLine(tokens) {
    let output = evaluatePostfix(tokens);
    if (output == 'error') {
        return output;
    }
    output = convertToInfix(tokens) + ' = ' + output;
    return output;
}

// Standardizes the error outputting process
function writeError(text) {
    process.stdout.write("ERROR - " + text + '\n');
}

// Given an array of RPN tokens, evaluatePostfix() will determine the answer for a given postfix notation.
function evaluatePostfix(values) {
    var charStack = [];
    var tokenCount = 1;
    var operandCount = 0;
    var operatorCount = 0;

    for (const c of values) {
        // Null/Empty inputs are invalid 
        if (c == null || c == '') {
            writeError('Empty Argument (extraneous comma) at Argument ' + tokenCount);
            return "error";
        } else if (!isOperator(c)){
            // If a character is not an operator, or a number it is also invalid
            if (isNaN(c)) {
                writeError("Invalid Character on Line " + lineCount + ", Argument " + tokenCount);
                return "error";

            } else {
                charStack.push(c);
                operandCount++;
                
            }
        } else {
            // If the stack does't have enough characters for an operation, it's invalid
            if (charStack.length < 2) {
                writeError("Too few arguments provided for operator '" + c + "' (Line " + lineCount + ", Argument " + tokenCount + ")");
                return "error";
            }
            if (c == '+') {
                secondVal = parseInt(charStack.pop());
                firstVal = parseInt(charStack.pop());
                charStack.push(eval(firstVal + secondVal));
            } else if (c == '-') {
                secondVal = parseInt(charStack.pop());
                firstVal = parseInt(charStack.pop());
                charStack.push(eval(firstVal - secondVal));
            } else if (c == '*') {
                secondVal = parseInt(charStack.pop());
                firstVal = parseInt(charStack.pop());
                charStack.push(eval(firstVal * secondVal));
            } else if (c == '/') {
                secondVal = parseInt(charStack.pop());
                firstVal = parseInt(charStack.pop());
                charStack.push(eval(firstVal / secondVal));
            }
            operatorCount++;
        }
        tokenCount += c.length;
    }

    // A proper RPN expression will have exactly 1 more operand than operands, otherwise it is invalid
    if ((operatorCount + 1) != operandCount) {
        writeError("Too many operators for the given operands. (" + operandCount + " Operands provided, " + (operandCount - 1) + " Operators expected)");
        return "error";
    }

    return charStack.pop();
}

// Given an array of RPN tokens, convertToInfix() will convert the postfix notation into infix notation so that it can be represented in a more human-readable format
function convertToInfix(values) {
    q = [];
    stack = [];
    prec = {'*':3, '/':3, '+':2, '-':2};

    // Get all operators
    for (const c of values) {
        if (isOperator(c)) {
            q.push(c);
        }
    }

    // Preform the conversion
    for (const c of values) {
        if (!isNaN(c)) {
            stack.push(c);
        } else if (isOperator(c)) {
            y = q.shift();

            let secondVal = stack.pop();
            let firstVal = stack.pop();
            if (prec[y] >= prec[q[0]] || q.length == 0) {
                stack.push(firstVal + " " + y + " " + secondVal);
            } else {
                stack.push('( '+ firstVal + " " + y + " " + secondVal +' )');
            }
        }
    }
    return stack.pop();
}


var filename = process.argv[2];
var lineCount = 0;
var rl = readline.createInterface({
    input : f.createReadStream(filename),
    output : process.stdout,
    terminal: false
});
// Iterate over each line in the input file
rl.on('line', function (text) {
    lineCount++;
    // We don't care about spaces, ignore them
    text = text.replace(/\s/g, '');
    // If the line isn't a comment, process it
    if (text[0] != '#') {
        // Get a list of all the tokens
        var tokens = text.split(',');
        var res = processLine(tokens);
        if (res != "error") {
            console.log(res);
        }
    }
});
