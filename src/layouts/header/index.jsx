import React from 'react';

const SiteHeader = () => {
    return (
        <header style={styles.header}>
          <div style={styles.logo}>자리부터잡아</div>
          <div>
            <button style={styles.button}>Profile</button>
            <button style={styles.button}>Log-out</button>
          </div>
        </header>
      );
    };
    
    const styles = {
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#f8f8f8',
      },
      logo: {
        fontSize: '24px',
        fontWeight: 'bold',
      },
      button: {
        marginLeft: '1rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#ff9f1c',  // 버튼 색상을 #ff9f1c
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      },
    };

export default SiteHeader;