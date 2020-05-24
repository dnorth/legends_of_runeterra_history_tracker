import React from 'react'
import classNames from 'classnames'
import Authentication from '../../util/Authentication/Authentication'

import '../../fonts/Beaufort for LOL Bold.ttf'
import '../../fonts/UniversLTCYR-55Roman.otf';

import './Config.css'

export default class ConfigPage extends React.Component{
    constructor(props){
        super(props)
        this.Authentication = new Authentication()

        //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null. 
        this.twitch = window.Twitch ? window.Twitch.ext : null
        this.state={
            finishedLoading:false,
            theme:'light'
        }
    }

    contextUpdate(context, delta){
        if(delta.includes('theme')){
            this.setState(()=>{
                return {theme:context.theme}
            })
        }
    }

    componentDidMount(){
        // do config page setup as needed here
        if(this.twitch){
            this.twitch.onAuthorized((auth)=>{
                this.Authentication.setToken(auth.token, auth.userId)
                if(!this.state.finishedLoading){
                    // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.
    
                    // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
                    this.setState(()=>{
                        return {finishedLoading:true}
                    })
                }
            })
    
            this.twitch.onContext((context,delta)=>{
                this.contextUpdate(context,delta)
            })
        }
    }

    handleChange = (e) => {
        this.setState({ value: e.target.value})
    }

    handleSubmit = (e) => {
        console.log('submitted!')
        e.preventDefault();
    }

    render(){
        const isLightTheme = this.state.theme==='light'

        if(this.state.finishedLoading && this.Authentication.isModerator()){
            return(
                <div className={classNames("Config", { 'Config-light': isLightTheme }, { 'Config-dark': !isLightTheme})}>
                        <h1 className="configTitle">Getting Started</h1>
                        <ConfigText 
                            content={<span>1. Download the <a className="appDownloadLink" target="_blank" href="https://s3.us-east-2.amazonaws.com/runeterra.history.tracker/Electron+Builds/Runeterra+History+Tracker+Installer+(win+latest).exe" download>Runeterra History Tracker App</a> Installer.</span>}
                            subtext={'Note: Windows Defender might prevent the installer from being run. In order to use this extension you need to click "More Info" and "Run Anyway".'}
                        />
                        <ConfigText 
                            content="2. Connect the app to your Twitch account."
                            subtext='Note: The Runeterra History Tracker is a "System Tray Only" application. Look for the icon where you might find your sound or network settings!'
                        />
                        <ConfigText content="3. Start playing Legends of Runeterra to track your history!" />
                </div>
            )
        }
        else{
            return(
                <div className="Config">
                    <div className={this.state.theme==='light' ? 'Config-light' : 'Config-dark'}>
                        Loading...
                    </div>
                </div>
            )
        }
    }
}

const ConfigText = ({ content, subtext}) => (
    <p className="configTextContainer">
        <span classNamee="configText">{content}</span>
        <span className="configSubtext">{subtext}</span>
    </p>
)