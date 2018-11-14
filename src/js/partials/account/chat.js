/*jshint esversion: 6 */

function initChat() {
	if (!$('#chat').length) {
		return false;
	}

	let $chat = $('#chat'),
		$chatForm = $('#chat-form'),
		$chatSendBtn = $chat.find('.js-chat-send'),
		$chatInput = $chat.find('.js-chat-message'),
		$chatBody = $chat.find('.js-chat-body'),
		$messagesContainer = $chat.find('.js-chat-messages-container'),
		chatForm = new Form('#chat-form', {
			validation: false
		});

	function init() {
		initSendHandler();
		initInputHandler();
	}

	function initSendHandler() {
		$chatSendBtn.on('click', sendMessage);
	}

	function initInputHandler() {
		$chatInput
			.on('keyup', function() {
				if ($chatInput.val() === '') {
					$chatSendBtn.addClass('btn--disable');
				} else {
					$chatSendBtn.removeClass('btn--disable');
				}
			})
			.on('keydown', function(event) {
				if (event.keyCode === 13) {
					event.preventDefault();
					sendMessage();
				}
			});
	}

	function sendMessage() {
		if ($chatInput.val() === '') {
			return false;
		}

		let message = $chatInput.val(),
			messageTemp = '<div class="chat-message">' +
			'<div class="chat-message__user">' +
			'<div class="chat-message__user-name">Я</div>' +
			'</div>' +
			`<div class="chat-message__message">${message}</div>` +
			'</div>';

		$messagesContainer.append(messageTemp);
		$chatInput.val('').closest('.form-field').removeClass('input-filled');
		$chatBody.scrollTop($chatBody[0].scrollHeight);
		$chatSendBtn.addClass('btn--disable');
	}

	init();
}

$(function() {
	initChat();
});
