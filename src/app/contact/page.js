export default function ContactPage() {
    return (
        <div className="container mt-5">
            <h1 className="section-title">Contact Us</h1>
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                    Have questions or need assistance? We'd love to hear from you!
                </p>
                <div style={{ textAlign: 'left', marginTop: '2rem' }}>
                    <p><strong>Email:</strong> support@shoplynx.com</p>
                    <p><strong>Phone:</strong> +63 912 345 6789</p>
                    <p><strong>Address:</strong> 123 Commerce Street, Manila, Philippines</p>
                </div>
            </div>
        </div>
    );
}
