import React, { Component } from 'react'

class InstallButton extends Component {
  state = {
    isShowBtn: false,
  }

  constructor (props) {
    super(props)
    this.deferredPrompt = undefined
  }

  componentWillMount () {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log("beforeinstallprompt")
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e
      this.setState({isShowBtn:true})
    })
  }

  handleInstallApp = () => {
// hide our user interface that shows our A2HS button.

    // Show the prompt
    this.deferredPrompt.prompt()
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt')
          this.setState({isShowBtn: false})
        } else {
          console.log('User dismissed the A2HS prompt')
        }
        this.deferredPrompt = null
      })
  }
  //PWA
  // handlePushTest = ()=>{
  //   askForPermissionToReceiveNotifications()
  //     .then((...e)=>console.log("aaaaaa",e))
  //     .catch((...e)=>console.log("bbbbb",e))
  //   // Push.create("Hello world!", {
  //   //   body: "How's it hangin'?",
  //   //   icon: '/icon.png',
  //   //   timeout: 4000,
  //   //   onClick: function () {
  //   //     window.focus();
  //   //     this.close();
  //   //   }
  //   // });
  // }

  render () {
    const {isShowBtn} = this.state
    if (!isShowBtn) {
      return null;
    }
    return null
    // return (
    //   <div>
    //       <button className="btn-effect get-app-btn" onClick={this.handleInstallApp}><span>Get Desktop App</span><span>Get Mobile App</span></button>
    //   </div>
    // )
  }
}

// eslint-disable-next-line no-extend-native
String.prototype.trimAllSpace = function () {
  const input = String(this)
  return input.replace(/\s/g, '')
}

export default InstallButton


