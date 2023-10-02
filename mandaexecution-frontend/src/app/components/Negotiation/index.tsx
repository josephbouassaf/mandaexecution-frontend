'use client'
import './style.css'
import {showPopup, showPopup2, submit, selectOption, printQrCode} from './config-script'

const Negotiation = () => {
// You can call this function when the div is clicked
    return (
        <div>
            <div id="root" className="login"></div>
            <h1 className="first-header">Host a voting session for you, your peers or counterparts.</h1>
            <div className="leftBig"><button className="button2" onClick={showPopup}>
            choose session</button></div>
            <div className="left">
                <p className="forpro">Dear voters</p>
                <p style={{paddingLeft: '10%'}}>
                    <b> </b> <br></br>
                    <b>Participate in a voting session</b><br></br>
                        1. Find a poll<br></br>
                        2. Vote
                </p>
            </div>
            <div style={{position: 'relative', top:'50%'}} onClick={showPopup2}>
            <div className="leftBig" style={{position:'relative', left:'750px', top:'0px', marginTop:'50px'}}><button className="button2" onClick={showPopup2}>create session</button></div>
            <div className="left" style={{position: 'relative',left:'750px',top:'-185px',backgroundColor: 'white'}}>
                <p className="forpro" style={{position: 'relative',left:'0px'}}>Dear proposers</p>
                <p style={{paddingLeft: '10%'}}> 
                <b> </b> <br></br>
                <b>Create your proposals voting session</b><br></br>
                    1. Set time-frame<br></br>
                    2. Choose who votes
                </p>
            </div>
            </div>
            <table id="existingTable">
                <thead>
                    <tr>
                    <th>Session</th>
                    <th>Status</th>
                    <th>Result</th>
                    <th>Visibility</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{fontSize: '100px'}} onClick={showPopup}>
                    <td>Acquire Tonic Finance</td>
                    <td>Open</td>
                    <td>Available in: 5 days</td>
                    <td>Public</td>
                    </tr>
                    <tr>
                    <td>BAL AAVE Token Swap</td>
                    <td>Open in 2 days 8 hours</td>
                    <td>Available in: 8 days</td>
                    <td>Public</td>
                    </tr>
                    <tr style={{fontSize: '100px'}}>
                    <td>Revised Treasury Diversification</td>
                    <td>Closed</td>
                    <td>Available</td>
                    <td>Public</td>
                    </tr>
                    <tr style={{fontSize: '100px'}}>
                    <td>Fei-Rari Merger</td>
                    <td>Closed</td>
                    <td>Available</td>
                    <td>Private</td>
                    </tr>
                    <tr style={{fontSize: '100px'}}>
                    <td>Gnosis-xDAI Temperature Check</td>
                    <td>Closed</td>
                    <td>Available</td>
                    <td>Private</td>
                    </tr>
                </tbody>
            </table>
            <div id="qrCodeContainer"></div>
            <div id="chatContainer"></div> 
            <div id="popup2" className="popup" style={{display: 'none'}}>
                <div className="mainpop">
                    <h1 style={{color: '#FFF'}}>New Proposal</h1>
                    <form id="proposal-form" className="styled-form" onSubmit={(event) => submit(event)}>
                    <div className="form-group">
                        <label className="form-label">Proposal Name</label>
                        <input type="text" name="proposal_name" className="form-input"/>
                    </div>
                
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-input"></textarea>
                    </div>
                
                    <div className="form-group date-group">
                        <div>
                        <label className="form-label">Start Date</label>
                        <input type="date" name="start_date" className="form-input"/>
                        </div>
                        <div>
                        <label className="form-label">End Date</label>
                        <input type="date" name="end_date" className="form-input"/>
                        </div>
                    </div>
                
                    <div className="form-group">
                        <label className="form-label">Intent</label>
                        <select name="intent" className="form-input">
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                        <option value="merge">Merge</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Vote Configuration</label>
                        <select name="intent" className="form-input">
                        <option value="TokenGated">Token Gated</option>
                        <option value="WalletGated">Wallet Gated</option>
                        </select>
                    </div>


                    <div className="form-group eth-address-section">
                        <label className="form-label">Enter eligible voters</label>
                        <div className="input-container">
                        <input type="text" name="ethereum_address" placeholder="Enter Ethereum address" className="form-input"/>
                        <button type="button" id="add-address-btn" className="add-address-btn">+</button>
                        </div>
                    </div>

                
                    <button type="submit" className="submit-btn" >Submit</button>
                    </form>
                </div>
            </div>    
            <div id="popup" className="popup" style={{display: 'none'}}>
                <div className="mainpop">
                    <h1 style={{color: '#FFF', fontSize: '28px',fontWeight: '400',lineHeight: '24px'}}>Proposal To Acquire Tonic Finance</h1>
                    <p className="description">By 0x2314123</p>
                    <div className="option-container">
                        <div className="option" id="option1" onClick={() =>selectOption('option1')}>
                            September 15, 4:00pm                        
                           
                            Voting
                            <div className="option-content" id="content1">
                                <p className="description"><b>Description</b></p>
                                <ul className="description" style={{width:'200%'}}>
                                    <li>Tonic Finance, a decentralized financial platform, is under consideration for acquisition.</li>
                                    <li>The proposal aims to integrate Tonic's assets and functionalities into our DAO.</li>
                                    <li>Acquisition could enhance our DAO's capabilities and expand its user base.</li>
                                    <li>Members are urged to review Tonic's performance metrics and potential synergies.</li>
                                    <li>Voting will determine the acceptance or rejection of this acquisition.</li>
                                    <li>Successful acquisition will require strategic planning for seamless integration.</li>
                                </ul>
                                <a href="https://xmtp-developer-quickstart.buibui69.repl.co">Chat with Participants</a>
                                <p className="description"><b>Submit Your order</b></p>
                                <ul className="description" style={{width:'200%'}}>
                                    <li>8/200 submitted.</li>
                                </ul>
                            </div>
                            <div className="option-container">
                                <div className="form-group">
                                    <label className="form-label">Token Weight</label>
                                    <textarea name="description" className="form-input"></textarea>
                                </div>
                            
                                <div className="form-group">
                                    <label className="form-label">Vote</label>
                                    <textarea name="description" className="form-input"></textarea>
                                </div>
                            
                                <button className="table-button" id="vote1">Vote 1 Weight Token</button>
                                <button className="table-button" id="vote2">Vote 2 Weight Tokens</button>
                            </div>
                        </div>
                    <div className="form-group">
                        <p className="description"><b>Submission Book</b></p>
                    </div>
                    </div>
                </div>
                <div className="option" id="option2" onClick={() => selectOption('option2')}>
                    September 15, 6:30pm
                    
                    Result
                    
                    <div className="option-content" id="content2">
                    <p className="description">Results</p>
                    <div className="result-box" style={{position:'relative',left:'-350px'}}><p className="description">The value chosen by the collective wisdom that minimizes the communities discontent is: </p>
                    <p className="description" style={{fontSize:'20px'}}>50,000.00</p></div>
                    </div>
                </div>
                </div>
            </div>
                );
}

export default Negotiation