import React from 'react';

const SiteFooter = () => {
    return (
        <footer style={styles.footer}>
          <div style={styles.content}>
            <p style={styles.text}>© 2024 MAGIC-pos. All rights reserved.</p>
            <nav style={styles.nav}>
              <a href="#" style={styles.link}>Privacy Policy</a>
              <a href="#" style={styles.link}>Terms of Service</a>
              <a href="#" style={styles.link}>Contact Us</a>
            </nav>
          </div>
        </footer>
      );
    };
    
    const styles = {
      footer: {
        backgroundColor: '#ff9f1c',  // Footer 배경색을 #ff9f1c로 변경
        padding: '1rem',
        marginTop: 'auto',
      },
      content: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
      },
      text: {
        margin: 0,
        color: 'white',  // 텍스트 색상을 흰색으로 변경하여 가독성 향상
      },
      nav: {
        display: 'flex',
      },
      link: {
        color: 'white',  // 링크 색상을 흰색으로 변경
        textDecoration: 'none',
        marginLeft: '1rem',
      },
    };

export default SiteFooter;