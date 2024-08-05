import React from 'react';

const styles = {
    footer: {
        backgroundColor: 'white',
        padding: '1rem',
        marginTop: 'auto'
    },
    content: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        fontSize: '0.8rem',
        color: 'grey'
    },
    text: {
        margin: 0
    },
    nav: {
        display: 'flex',
    },
    link: {
        color: 'grey',
        textDecoration: 'none',
        marginLeft: '1rem',
    }
};

const SiteFooter = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.content}>
                <p style={styles.text}>© 2024 MAGIC-POS. All rights reserved.</p>
                <br />
                <nav style={styles.nav}>
                    <a href="#" style={styles.link}>Privacy Policy</a>
                    <a href="#" style={styles.link}>Terms of Service</a>
                    <a href="#" style={styles.link}>Contact Us</a>
                </nav>
            </div>
        </footer>
    );
};
    
    

export default SiteFooter;