import React from 'react';
import './Sidebar.css';

class Sidebar extends React.Component {
  state = {
    isSidebarVisible: false, // Initially set to false to start with a closed sidebar
    isSafeModeOn: false,
  };

  toggleSidebar = () => {
    this.setState(prevState => ({
      isSidebarVisible: !prevState.isSidebarVisible,
    }));
  };

  toggleSafeMode = () => {
    this.setState(prevState => ({
      isSafeModeOn: !prevState.isSafeModeOn,
    }));
  }

  render() {
    const { isSidebarVisible, isSafeModeOn } = this.state;

    return (
      <>
        <button onClick={this.toggleSidebar} className="toggle-button">
          {isSidebarVisible ? '<' : '>'}
        </button>

        <aside className={`sidebar ${isSidebarVisible ? 'open' : 'closed'}`}>
          <h1 className='LogoName'>WakeyDrivey</h1>
          <div className="input-group">
            <label  htmlFor="from">From:</label>
            <input type="text" id="from" name="from" />
          </div>
          <div className="input-group">
            <label htmlFor="to">To:</label>
            <input type="text" id="to" name="to" />
          </div>
          <div className="input-group">
            <label className='stationheader' htmlFor="charging">Nearby Charging Stations</label>
            <ul>
              <li>EV-Lime Station</li>
              <li>EV-Orange Station</li>
              <li>EV-Blue Station</li>
            </ul>
          </div>
          <button className="safe-mode-btn" onClick={this.toggleSafeMode}>
            Safe Mode: {isSafeModeOn ? 'On' : 'Off'}
          </button>
         
        </aside>
      </>
    );
  }

  detectDrowsiness = () => {
    alert('Drowsiness detection initiated!');
  }
}

export default Sidebar;
