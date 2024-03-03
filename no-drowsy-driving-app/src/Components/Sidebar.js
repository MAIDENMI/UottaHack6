import React from 'react';
import './Sidebar.css';

class Sidebar extends React.Component {
  // You can add state and methods here if needed, like handling form submission

  render() {
    return (
      <aside className="sidebar">
        <h1>WakeyDrivey</h1>
        <div className="input-group">
          {/* <label htmlFor="charging">Nearby Charging Stations</label> */}
          
        
        </div>
        {/* <button className="drowsiness-btn" onClick={this.detectDrowsiness}>
          Detect Drowsiness
        </button> */}
      </aside>
    );
  }

  detectDrowsiness = () => {
    // Implement drowsiness detection logic or API call here
    alert('Drowsiness detection initiated!');
  }
}

export default Sidebar;
