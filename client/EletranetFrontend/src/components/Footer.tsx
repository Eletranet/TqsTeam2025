import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Footer = () => {

const quickLinks = [
  { label: 'Início', href: '/mapa' },
  { label: 'Estações', href: '/mapa' },
  {label:'Rotas Personalizadas',href:'/rotas'}

];
  const services = ['Carregamento Rápido', 'Reservas Online', 'Rotas Personalizadas'];

  return (
    <>
      <style jsx>{`
        .link-hover:hover {
          color: #4ade80;
          transition: color 0.2s ease;
        }
        
        .social-icon:hover {
          transform: translateY(-2px);
          transition: all 0.2s ease;
        }
      `}</style>

      <footer style={{
        width: '100%',
        marginTop: 'auto',
        backgroundColor: '#111111',
        color: '#ffffff',
        borderTop: '1px solid #2a2a2a'
      }}>
        {/* Main Footer Content */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '48px 24px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            
            {/* Brand Section */}
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#4ade80',
                marginBottom: '12px',
                margin: '0 0 12px 0'
              }}>
                ⚡ ElectraNet
              </h2>
              <p style={{
                color: '#9ca3af',
                lineHeight: '1.5',
                fontSize: '0.95rem',
                marginBottom: '20px',
                maxWidth: '280px'
              }}>
                Conectando o futuro da mobilidade elétrica com estações de carregamento inteligentes.
              </p>
              
      
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{
                color: '#ffffff',
                fontWeight: '500',
                marginBottom: '16px',
                fontSize: '1rem'
              }}>
                Links Rápidos
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {quickLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="link-hover"
                    style={{
                      color: '#9ca3af',
                      textDecoration: 'none',
                      fontSize: '0.9rem'
                    }}
                  >
                {item.label}
                   </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 style={{
                color: '#ffffff',
                fontWeight: '500',
                marginBottom: '16px',
                fontSize: '1rem'
              }}>
                Serviços
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {services.map((item) => (
                  <span
                    key={item}
                    className="link-hover"
                    style={{
                      color: '#9ca3af',
                      textDecoration: 'none',
                      fontSize: '0.9rem'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 style={{
                color: '#ffffff',
                fontWeight: '500',
                marginBottom: '16px',
                fontSize: '1rem'
              }}>
                Contacto
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}>
                  <span style={{ color: '#4ade80', fontSize: '0.9rem' }}>📍</span>
                  <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                    Aveiro, Portugal
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}>
                  <span style={{ color: '#4ade80', fontSize: '0.9rem' }}>📞</span>
                  <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                    +351 234 567 890
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}>
                  <span style={{ color: '#4ade80', fontSize: '0.9rem' }}>✉️</span>
                  <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                    info@electranet.pt
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr style={{
            border: 'none',
            height: '1px',
            backgroundColor: '#2a2a2a',
            margin: '40px 0 24px 0'
          }} />

          {/* Bottom Section */}
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth < 768 ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px'
          }}>
            <p style={{
              color: '#9ca3af',
              margin: 0,
              fontSize: '0.875rem'
            }}>
              © {new Date().getFullYear()} ElectraNet. Todos os direitos reservados.
            </p>
            
    
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;