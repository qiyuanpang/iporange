import styled from 'styled-components';

const Styles = styled.div`
.center {
    margin: auto;
    width: 50%;
    padding: 10px;
}
`

function ContactUSPage() {
    return (
        <Styles>
            <div className='center container'>
                <h4>Please contact us if you have any question or suggestion: </h4>
                <h5><a href="https://www.linkedin.com/in/pangqy/">Qiyuan Pang</a> - Founder and Owner </h5>
                <h5>Email: iporangeweb@gmail.com</h5>
            </div>
        </Styles>
    )
}

export default ContactUSPage;
