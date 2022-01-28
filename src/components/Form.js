import React, { Component } from 'react'

class Form extends Component {

    constructor(props) {
        super(props)

        this.state = {
            username: ''
        }
    }

    handleUsernameChange = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    handleSubmit = (event) => {
        
        let li_username = this.state.username
        alert(li_username)
        //alert(`${this.state.username}`)
    }

    render() {
        const {username} = this.state

        return (
            <form onSubmit={this.handleSubmit}>    
                <div>
                    <label>Lichess Username</label>
                    <input type='text' value={username} onChange={(this.handleUsernameChange)} />
                </div>
                <button type="submit">Generate Insights</button>
            </form>
        )
    }
}

export default Form