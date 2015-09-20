/**
* Team page
*/

var TeamPage = React.createClass({
  handleTictailerSelect: function (index) {
    this.setState({tictailer: {}}, function () {
      this.setState({tictailer: this.state.team[index]}, function() {
        $('body').animate({ scrollTop: $(document).height() }, 1000);
      });
    }.bind(this));
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
        // TODO: better error handling
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function () {
    return (
      <div className="teamPage">
        <TictailerList onTictailerSelect={this.handleTictailerSelect} team={this.state.team} />
        {this.state.tictailer.id ? <ChatContainer tictailer={this.state.tictailer} /> : null}
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
      <div className="tictailerList">
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
      window.scrollTo(0,document.body.scrollHeight);
    });
  },
  handleResponseSubmit: function (message) {
    var newChat = this.state.chat;
    newChat.pop();
    newChat.push({type: 'human', text: message});
    this.setState({chat: newChat})
    this.setState({timer: setInterval(this.showNextMessage, this.state.timerInterval)});
  },
  getInitialState: function () {
    return {messages: [], chat: [], index: 0, timer: null, timerInterval: 2000};
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
