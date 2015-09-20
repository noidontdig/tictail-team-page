/**
* Team page
*/

var TeamPage = React.createClass({
  handleTictailerSelect: function (index) {
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
    return (
      <div className="teamPage">
        <TictailerList onTictailerSelect={this.handleTictailerSelect} team={this.state.team} />
        {this.state.tictailer.id ? <ChatContainer onChatEnd={this.handleChatEnd} tictailer={this.state.tictailer} /> : null}
      </div>
    );
  }
});

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

var ChatContainer = React.createClass({
  showNextMessage: function () {
    if (this.state.index >= this.state.messages.length) {
      clearInterval(this.state.timer);
      $('html,body').animate({scrollTop: $('h2').position().top}, 1000, 'swing', function () {
        this.props.onChatEnd();
      }.bind(this));
      return;
    }
    var nextMessage = this.state.messages[this.state.index];
    if (!(nextMessage.type == 'robot')) {
      clearInterval(this.state.timer);
    }

    var newChat = this.state.chat;
    if (this.state.index == 0) {
      newChat.push({type: 'robot', text: 'Hi, I\'m ' + this.props.tictailer.first_name + '.'});
    } else {
      newChat.push(this.state.messages[this.state.index]);
    }

    this.setState({chat: newChat, index: this.state.index + 1}, function () {
     $('html,body').animate({scrollTop: $(document).height()}, 1e3);
    });
  },
  handleResponseSubmit: function (message) {
    var newChat = this.state.chat;
    newChat.pop();
    newChat.push({type: 'human', text: message});
    this.setState({chat: newChat, timer: setInterval(this.showNextMessage, this.state.timerInterval)});
  },
  getInitialState: function () {
    return {messages: [], chat: [], index: 0, timer: null, timerInterval: 1500};
  },
  componentDidMount: function () {
    this.setState({messages: chatMessages}, function () {
      this.setState({timer: setInterval(this.showNextMessage, this.state.timerInterval)});
    }.bind(this));
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

//
// Animations
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
