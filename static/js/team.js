//
// # Team Page
//
//  An impressive listing page with a great deal of *wow* factor
//

//
// ## TeamPage
//
// Holds state for the app:
// * **team**, the list of team members to display
// * **tictailer**, the team member the user selected to talk to
//
var TeamPage = React.createClass({
  handleTictailerSelect: function (index) {
    // Clear `tictailer` before setting it again so the chat resets
    this.setState({tictailer: {}}, function () {
      this.setState({tictailer: this.state.team[index]}, function() {
        $('html,body').animate({scrollTop: $(document).height()}, 1000);
      });
    }.bind(this));
  },
  handleChatEnd: function () {
    this.setState({tictailer: {}});
  },
  getInitialState: function () {
    return {team: [], tictailer: {}};
  },
  // Load team member list from API.
  componentDidMount: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function (team) {
        this.setState({team: team});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function () {
    // Only show chat if a tictailer has been selected
    return (
      <div className="teamPage">
        <TictailerList onTictailerSelect={this.handleTictailerSelect} team={this.state.team} />
        {this.state.tictailer.id ? <ChatContainer onChatEnd={this.handleChatEnd} tictailer={this.state.tictailer} /> : null}
      </div>
    );
  }
});

//
// ## TictailerList
//
// Displays the list of Tictailers.
//
var TictailerList = React.createClass({
  handleTictailerSelect: function (index) {
    this.props.onTictailerSelect(index);
  },
  render: function () {
    var tictailerNodes = this.props.team.map(function (tictailer, index) {
      return (
        <Tictailer onTictailerSelect={this.handleTictailerSelect}
                   tictailer={tictailer}
                   index={index} />
      );
    }, this);
    return (
      <div className="tictailerList wow fadeIn">
        {tictailerNodes}
      </div>
    );
  }
});

//
// ## Tictailer
//
// Displays a team member.
//
var Tictailer = React.createClass({
  handleClick: function () {
    this.props.onTictailerSelect(this.props.index);
  },
  render: function () {
    var divStyle = {
      backgroundColor: '#' + this.props.tictailer.color,
      backgroundImage: 'url("' + this.props.tictailer.image + '")',
      backgroundSize: 'cover'
    };
    return (
      <div className="tictailer" onClick={this.handleClick} style={divStyle}>
        <div className="overlay"></div>
        <div className="info">
          <div className="name">{this.props.tictailer.first_name} {this.props.tictailer.last_name}</div>
          <div className="teamName">{this.props.tictailer.team}</div>
        </div>
      </div>
    );
  }
});

//
// ## ChatContainer
//
// Displays and holds state for the chat:
//
// * **chat**, actual list of messages displayed by the chat
//
// Instance variables:
// * **messages**, list of messages to read into the chat
// * **index**, index of next message to display
// * **timer**, timer for the chat
// * **timerInterval**, speed of tictailer's responses
//
var ChatContainer = React.createClass({
  // Handles showing the next message in the chat
  showNextMessage: function () {
    // If the chat is over, hide chat and scroll to top
    if (this.index >= this.messages.length) {
      clearInterval(this.timer);
      $('html,body').animate({scrollTop: $('h2').position().top}, 1000, 'swing', function () {
        this.props.onChatEnd();
      }.bind(this));
      return;
    }
    var nextMessage = this.messages[this.index];
    // Pause timer if it's the user's turn to talk
    if (!(nextMessage.type == 'robot')) {
      clearInterval(this.timer);
    }
    var newChat = this.state.chat;
    // Custom first message
    // Would have liked a more graceful way to handle this but React
    // doesn't support string interpolation and I didn't have time to implement.
    if (this.index == 0) {
      newChat.push({type: 'robot', text: 'Hi, I\'m ' + this.props.tictailer.first_name + '.'});
    } else {
      newChat.push(this.messages[this.index]);
    }

    this.index += 1;
    this.setState({chat: newChat}, function () {
     $('html,body').animate({scrollTop: $(document).height()}, 1e3);
    });
  },
  handleResponseSubmit: function (message) {
    var newChat = this.state.chat;
    newChat.pop();
    newChat.push({type: 'human', text: message});
    this.setState({chat: newChat});
    this.timer = setInterval(this.showNextMessage, this.timerInterval);
  },
  getInitialState: function () {
    return {chat: []};
  },
  componentDidMount: function () {
    this.index = 0;
    this.timerInterval = 1500;
    this.messages = chatMessages;
    this.timer = setInterval(this.showNextMessage, this.timerInterval);
  },
  componentWillUnmount: function() {
    clearTimeout(this._timer);
  },
  render: function () {
    var avatarStyle = {
      backgroundColor: '#' + this.props.tictailer.color,
      backgroundImage: 'url("' + this.props.tictailer.image + '")',
      backgroundSize: 'cover'
    };
    return (
      <div className="chatContainer">
        <SpeechBubbleList onResponseSubmit={this.handleResponseSubmit} chat={this.state.chat} />
        <div className="avatar" style={avatarStyle}></div>
      </div>
    );
  }
});

//
// ## SpeechBubbleList
//
// Displays the list of messages as speech bubbles.
//
var SpeechBubbleList = React.createClass({
  handleResponseSubmit: function (message) {
    this.props.onResponseSubmit(message);
  },
  render: function () {
    var bubbleNodes = this.props.chat.map(function (message) {
      return (
        <SpeechBubble onResponseSubmit={this.handleResponseSubmit} message={message} />
      );
    }, this);
    return (
      <div className="speechBubbleList">
        {bubbleNodes}
      </div>
    );
  }
});

//
// ## SpeechBubble
//
// Displays a message as a speech bubble or an input bubble if
// it's the user's turn to talk.
//
var SpeechBubble = React.createClass({
  handleResponseSubmit: function (message) {
    this.props.onResponseSubmit(message);
  },
  render: function () {
    var bubbleClass = 'speechBubble line ' + (this.props.message.type == 'robot' ? 'robot' : 'human');
    var animationClass = 'message animated ' + (this.props.message.type == 'robot' ? 'fadeInUp' : 'pulse');
    var bubbleDiv = this.props.message.type == 'input' ?
        <InputBubble onResponseSubmit={this.handleResponseSubmit} /> :
        <div className={animationClass}>{this.props.message.text}</div>;
    return (
      <div className={bubbleClass}>
        {bubbleDiv}
      </div>
    );
  }
});

//
// ## InputBubble
//
// Displays the input form to get the user's answers.
//
var InputBubble = React.createClass({
  handleSubmit: function (event) {
    event.preventDefault();
    this.props.onResponseSubmit(React.findDOMNode(this.refs.input).value.trim());
    return;
  },
  componentDidMount: function () {
    document.getElementById('input').focus();
  },
  render: function () {
    return (
      <form className="inputBubble message animated fadeInUp" onSubmit={this.handleSubmit}>
        <input id="input" type="text" placeholder="Write a response..." ref="input" />
      </form>
    );
  }
})

React.render(
  <TeamPage url="contacts" />,
  document.getElementById('content')
);


// =====================================
//
// Custom Animations
//

//
// # Scroll Handler
//
// To make chat animations smooth, the avatar's position is fixed
// when scrolled to the bottom.
//
var lastScrollTop = 0;
function scrollHandler (event) {
  var scrollTop = $('body').scrollTop();
  if (scrollTop > lastScrollTop) {
    if (scrollTop >= 3000 && scrollTop + 1000 >= $(document).height()) {
      $('body').addClass('fix-avatar');
      } else {
      $('body').removeClass('fix-avatar');
    }
  } else {
    $('body').removeClass('fix-avatar');
  }
  lastScrollTop = scrollTop;
}

$(window).on('scroll', scrollHandler);
