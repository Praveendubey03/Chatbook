class ChatEngine {
    constructor(chatBoxId, userEmail) {
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:5000');

        if (this.userEmail) {
            this.connectionHandler();
        }
    }

    connectionHandler() {
        let self = this;

        this.socket.on('connect', function() {
            console.log('Connection established using sockets...!');

            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function(data) {
                console.log('A user joined!', data);
                $('#chat-messages-list').append($('<li>').text(`${data.user_email} has joined the chat.`).addClass('system-message'));
            });
        });

        // Sending a message on clicking the send message button
        $('#send-message').click(function() {
            let msg = $('#chat-message-input').val();

            if (msg !== '') {
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
                $('#chat-message-input').val(''); // Clear input after sending
            }
        });

        self.socket.on('receive_message', function(data) {
            console.log('Message received:', data.message);
            let newMessage = $('<li>');
            let messageType = (data.user_email === self.userEmail) ? 'self-message' : 'other-message';

            newMessage.append($('<span>', { html: data.message }));
            newMessage.append($('<sub>', { html: data.user_email }));
            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
            $('#chat-messages-list').scrollTop($('#chat-messages-list')[0].scrollHeight); // Scroll to the bottom
        });
    }
}
