import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: 'LINESeedKR-Rg';
        src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/LINESeedKR-Rg.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
    }
        
    @font-face {
        font-family: 'LINESeedSans_W_Rg';
        src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/LINESeedSans_W_Rg.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
    }

    html, body {
        font-family: 'LINESeedKR-Rg', 'LINESeedSans_W_Rg', sans-serif;
    }
`;

export default GlobalStyle;