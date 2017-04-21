console.log("Sanity Check: JS is working!");
let tester = 'tester';

let insertObj = {
	category: null,
	samples: [],
	clickCount: 0,
};

let synObj = {
	keyWord: '',
	syns: [''],
};

myVar = 88;


$(document).ready(function(){
	$('.dropdown').click(function(event){
		// reset clickCount if a new category is selected
		if (insertObj.category !== $(this).data("category")) {
			console.log('NEW CATEGORY');
			clickCount = 0;
		insertObj.category = $(this).data("category");
		console.log('category: ' + insertObj.category); // Get the data-category
		// set choose button to text category HTML
		$('#chooseButton').text($(this).text());
		}
  });

	// insertnNoteButton click
	$('#insertButton').click(function() {
		console.log('insertNoteButton CLICKED!');
		if (insertObj.samples === []) {
		// ajax call to getNotesbyCategory
			$.ajax({
				method: 'GET',
				url: '/api/notes/' + insertObj.category,
				success: insertSuccess,
				error: handleError
			});			
		}

	});

	// testButton click
	$('#testButton').click(function() {

		console.log('insertNoteButton CLICKED!');
		let pos =$('#textarea').getCursorPosition();
		console.log('pos: ' + pos);
		let textareaString = $('#textarea').val();
		console.log('initial click char at pos: ' + textareaString.charAt(pos));
		let selectedWord = findWordAtPos(pos, textareaString);
		$(this).button('reset');
		$.ajax({
			method: 'GET',
			url: '/api/syn/' + selectedWord,
			success: synSuccess,
			error: synError
		});
	});
});
// ^^ End of document.ready ^^

function findWordAtPos(pos, textareaString) {
	// set i to the cursor position
	let i = pos;
	// instantiate selectedWord
	let selectedWord = '';

	// keep moving "backwards" along the textString
	// until we reach whitespace, aka the start of the word.
	if (textareaString.charAt(i) === ' ') {i--;}
	while (textareaString.charAt(i) !== ' ' && i > -1) {
		i--;
	}
	console.log('while broken. i = ' + i);
	console.log('character at i: ' + textareaString.charAt(i));

	// move forward in textString, add each character to selectedWord
	// until we get to the end of the word.
	i++;
	while (textareaString.charAt(i) !== ' ' && i < textareaString.length) {
		//add each character to selectedWord
		selectedWord += textareaString.charAt(i);
		i++;
	}
	console.log('selectedWord: ' + selectedWord);
	synObj.keyWord = selectedWord;
	return selectedWord;
}

// When index comes back:
function insertSuccess(json) {
	console.log('insertSuccess json: ' + JSON.stringify(json));
	notes = json;
	let textareaString = $('#textarea').val();
	// if this is the first click, insert notes[0].
	if (insertObj.clickCount === 0) {
		$('#textarea').val(textareaString + notes[insertObj.clickCount].content);
		textareaString = $('#textarea').val();

	} else {
		// after first click, replace the preceding sample.
		console.log('insertSuccess in else: ');
		console.log("1: " + textareaString);
		let currentSample = notes[insertObj.clickCount];
		currentSample = "HO";
		console.log("2: " + currentSample);
		let currentSampleRegEx = new RegExp(textareaString,"g");
		console.log("3: " + currentSampleRegEx);
		textareaString = textareaString.replace(currentSampleRegEx, "What uup baby face.");
		console.log("2" + textareaString);
		$('#textarea').val(textareaString);
	}
	insertObj.clickCount++;
}

function handleError(e) {
	console.log('there was an error: e');
}

function synSuccess(json) {
	console.log('synSuccess.');
	console.log('synSuccess json: ' + json);
	console.log('synSuccess json[0]: ' + json[0]);
	console.log('synSuccess json[1]: ' + json[1]);
	synObj.syns = json;
	console.log('synObj.synonyms[1]: ' + synObj.syns[1]);
	$('.synList').remove();
	let synArray = json;
	let synListHTML = '';
	synListHTML = '<a id="synList" href="#" class="list-group-item active synList">' + synObj.keyWord + '</a>'
	for (let i = 0; i < 4 && i < synArray.length ; i++) {
		synListHTML += '<a href="#" class="list-group-item synList">' + synArray[i] + '</a>'
	}
	$('#synonymsDiv').append(synListHTML);
}

function synError(e) {
	console.log('ERROR IN APP.JS !!' + JSON.stringify(e));
}

// This function determines the cursor's position in the textfield
(function ($, undefined) {
	$.fn.getCursorPosition = function() {
	    var el = $(this).get(0);
	    var pos = 0;
	    if('selectionStart' in el) {
	        pos = el.selectionStart;
	    } else if('selection' in document) {
	      el.focus();
	      var Sel = document.selection.createRange();
	      var SelLength = document.selection.createRange().text.length;
	      Sel.moveStart('character', -el.value.length);
	      pos = Sel.text.length - SelLength;
	    }
	    return pos;
	};
})(jQuery);