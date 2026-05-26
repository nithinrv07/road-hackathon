import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2, Shield, Wrench, FileText, Phone, MapPin, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Password strength analyzer helper
const getPasswordStrength = (pass: string) => {
  if (!pass) return { score: 0, text: '', color: 'transparent' };
  if (pass.length < 6) return { score: 1, text: 'Too short', color: '#ef233c' };
  
  let score = 1;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  
  switch (score) {
    case 1:
    case 2:
      return { score, text: 'Weak password', color: '#ef233c' };
    case 3:
      return { score, text: 'Medium strength', color: '#ffb703' };
    case 4:
      return { score, text: 'Strong password', color: '#2a9d8f' };
    case 5:
      return { score, text: 'Highly secure', color: '#06d6a0' };
    default:
      return { score: 0, text: '', color: 'transparent' };
  }
};

interface FormErrors {
  [key: string]: string;
}

export const LoginCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        window.location.hash = '#sos';
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', justifyContent: 'center', minHeight: '360px' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{ display: 'inline-flex', alignSelf: 'center', margin: '0 auto 1.5rem auto' }}
        >
          <CheckCircle2 size={64} color="var(--primary)" />
        </motion.div>
        <h2 className="auth-title" style={{ fontSize: '1.8rem' }}>Welcome Back</h2>
        <p className="auth-subtitle" style={{ marginBottom: '1.5rem' }}>
          Response Node connection established successfully. Redirecting you...
        </p>
        <div className="pulse-ring" style={{ position: 'relative', width: 60, height: 60, margin: '0 auto' }}></div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`auth-card ${shake ? 'shake' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="auth-header">
        <h2 className="auth-title">Node Login</h2>
        <p className="auth-subtitle">
          Access the ROADSoS dashboard or <a href="#register">register a new node</a>
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} noValidate>
        {/* Email */}
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className="input-wrapper">
            <input 
              type="email"
              className="input-control"
              placeholder="operator@roadsos.org"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              style={errors.email ? { borderColor: 'var(--primary)', boxShadow: '0 0 0 4px rgba(239, 35, 60, 0.15)' } : {}}
            />
            <Mail size={18} className="input-icon" />
          </div>
          <AnimatePresence>
            {errors.email && (
              <motion.span 
                className="validation-error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <AlertCircle size={14} /> {errors.email}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Password */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label">Password</label>
            <a href="#reset-password" className="forgot-password">Forgot password?</a>
          </div>
          <div className="input-wrapper">
            <input 
              type={showPassword ? 'text' : 'password'}
              className="input-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              style={errors.password ? { borderColor: 'var(--primary)', boxShadow: '0 0 0 4px rgba(239, 35, 60, 0.15)' } : {}}
            />
            <Lock size={18} className="input-icon" />
            <button 
              type="button" 
              className="input-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <AnimatePresence>
            {errors.password && (
              <motion.span 
                className="validation-error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <AlertCircle size={14} /> {errors.password}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <button 
          type="submit" 
          className="btn btn-solid" 
          disabled={isSubmitting}
          style={{ 
            marginTop: '0.5rem', 
            justifyContent: 'center', 
            position: 'relative', 
            overflow: 'hidden',
            opacity: isSubmitting ? 0.8 : 1,
            pointerEvents: isSubmitting ? 'none' : 'auto'
          }}
        >
          {isSubmitting ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Verifying Node Credentials...
            </span>
          ) : (
            <>
              Connect Node <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export const RegisterCard = () => {
  const [role, setRole] = useState<'citizen' | 'responder'>('citizen');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyAddress, setEmergencyAddress] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [serviceType, setServiceType] = useState('Ambulance');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (!/^\+?[0-9\s\-()]{7,15}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!emergencyName.trim()) {
      newErrors.emergencyName = 'Contact name is required';
    }

    if (!emergencyPhone.trim()) {
      newErrors.emergencyPhone = 'Contact phone is required';
    } else if (!/^\+?[0-9\s\-()]{7,15}$/.test(emergencyPhone)) {
      newErrors.emergencyPhone = 'Please enter a valid phone number';
    }

    if (!emergencyAddress.trim()) {
      newErrors.emergencyAddress = 'Contact address is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (role === 'responder' && !badgeNumber.trim()) {
      newErrors.badgeNumber = 'Verification Badge ID is required for emergency responders';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);
    
    // Simulate API registration
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', justifyContent: 'center', minHeight: '400px' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{ display: 'inline-flex', alignSelf: 'center', margin: '0 auto 1.5rem auto' }}
        >
          <CheckCircle2 size={64} color="var(--primary)" />
        </motion.div>
        <h2 className="auth-title" style={{ fontSize: '1.8rem' }}>Node Registered!</h2>
        <p className="auth-subtitle" style={{ marginBottom: '2rem', padding: '0 1rem' }}>
          Your dispatch node has been created. A verification email has been sent to verify your credentials.
        </p>
        <a 
          href="#login" 
          className="btn btn-solid" 
          style={{ alignSelf: 'center', width: '200px', justifyContent: 'center' }}
        >
          Go to Login
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`auth-card ${shake ? 'shake' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: '540px' }}
    >
      <div className="auth-header">
        <h2 className="auth-title">Register Node</h2>
        <p className="auth-subtitle">
          Join the emergency network or <a href="#login">login to existing node</a>
        </p>
      </div>

      {/* Role Selection */}
      <div className="form-group">
        <label className="form-label">Node Account Type</label>
        <div className="role-selector">
          <div 
            className={`role-option ${role === 'citizen' ? 'active' : ''}`}
            onClick={() => {
              setRole('citizen');
              // Clear role error if switching
              if (errors.badgeNumber) {
                const { badgeNumber, ...rest } = errors;
                setErrors(rest);
              }
            }}
          >
            <Shield size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle', display: 'inline' }} />
            General Citizen
          </div>
          <div 
            className={`role-option ${role === 'responder' ? 'active' : ''}`}
            onClick={() => setRole('responder')}
          >
            <Wrench size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle', display: 'inline' }} />
            Emergency Unit
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }} noValidate>
        {/* Name */}
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <div className="input-wrapper">
            <input 
              type="text"
              className="input-control"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              style={errors.name ? { borderColor: 'var(--primary)', boxShadow: '0 0 0 4px rgba(239, 35, 60, 0.15)' } : {}}
            />
            <User size={18} className="input-icon" />
          </div>
          <AnimatePresence>
            {errors.name && (
              <motion.span 
                className="validation-error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <AlertCircle size={14} /> {errors.name}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Email & Mobile Number Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <input 
                type="email"
                className="input-control"
                placeholder="operator@roadsos.org"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                style={errors.email ? { borderColor: 'var(--primary)', boxShadow: '0 0 0 4px rgba(239, 35, 60, 0.15)' } : {}}
              />
              <Mail size={18} className="input-icon" />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.span 
                  className="validation-error"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <AlertCircle size={14} /> {errors.email}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Number */}
          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <div className="input-wrapper">
              <input 
                type="tel"
                className="input-control"
                placeholder="+1 (555) 0199"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                style={errors.phone ? { borderColor: 'var(--primary)', boxShadow: '0 0 0 4px rgba(239, 35, 60, 0.15)' } : {}}
              />
              <Phone size={18} className="input-icon" />
            </div>
            <AnimatePresence>
              {errors.phone && (
                <motion.span 
                  className="validation-error"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <AlertCircle size={14} /> {errors.phone}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Emergency Contact Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0', color: 'var(--text-muted)' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)' }}>Emergency Contact Details</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        {/* Emergency Contact Name & Phone Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Emergency Name */}
          <div className="form-group">
            <label className="form-label">Contact Name</label>
            <div className="input-wrapper">
              <input 
                type="text"
                className="input-control"
                placeholder="John Doe"
                value={emergencyName}
                onChange={(e) => {
                  setEmergencyName(e.target.value);
                  if (errors.emergencyName) setErrors({ ...errors, emergencyName: '' });
                }}
                style={errors.emergencyName ? { borderColor: 'var(--primary)', boxShadow: '0 0 0 4px rgba(239, 35, 60, 0.15)' } : {}}
              />
              <User size={18} className="input-icon" />
            </div>
            <AnimatePresence>
              {errors.emergencyName && (
                <motion.span 
                  className="validation-error"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <AlertCircle size={14} /> {errors.emergencyName}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Emergency Phone */}
          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <div className="input-wrapper">
              <input 
                type="tel"
                className="input-control"
                placeholder="+1 (555) 0188"
                value={emergencyPhone}
                onChange={(e) => {
                  setEmergencyPhone(e.target.value);
                  if (errors.emergencyPhone) setErrors({ ...errors, emergencyPhone: '' });
                }}
                style={errors.emergencyPhone ? { borderColor: 'var(--primary)', boxShadow: '0 0 0 4px rgba(239, 35, 60, 0.15)' } : {}}
              />
              <Phone size={18} className="input-icon" />
            </div>
            <AnimatePresence>
              {errors.emergencyPhone && (
                <motion.span 
                  className="validation-error"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <AlertCircle size={14} /> {errors.emergencyPhone}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Emergency Contact Address */}
        <div className="form-group">
          <label className="form-label">Contact Address</label>
          <div className="input-wrapper">
            <input 
              type="text"
              className="input-control"
              placeholder="123 Rescue St, Safe City"
              value={emergencyAddress}
              onChange={(e) => {
                setEmergencyAddress(e.target.value);
                if (errors.emergencyAddress) setErrors({ ...errors, emergencyAddress: '' });
              }}
              style={errors.emergencyAddress ? { borderColor: 'var(--primary)', boxShadow: '0 0 0 4px rgba(239, 35, 60, 0.15)' } : {}}
            />
            <MapPin size={18} className="input-icon" />
          </div>
          <AnimatePresence>
            {errors.emergencyAddress && (
              <motion.span 
                className="validation-error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <AlertCircle size={14} /> {errors.emergencyAddress}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Divider line */}
        <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }}></div>

        {/* Critical Health Issues */}
        <div className="form-group">
          <label className="form-label">Critical Medical Conditions / Allergies</label>
          <div className="input-wrapper">
            <input 
              type="text"
              className="input-control"
              placeholder="e.g. Asthma, Penicillin allergy, diabetic, A+ Blood (Optional)"
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
            />
            <Heart size={18} className="input-icon" />
          </div>
        </div>

        {/* Role Specific Fields (Collapsible UI) */}
        <AnimatePresence initial={false}>
          {role === 'responder' && (
            <motion.div
              initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 5 }}
              exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '0.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Service Division</label>
                  <div className="input-wrapper">
                    <select
                      className="input-control"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      style={{ paddingLeft: '1rem' }}
                    >
                      <option value="Ambulance">Ambulance / Medical</option>
                      <option value="Towing">Towing Service</option>
                      <option value="Road Rescue">Road Rescue / Police</option>
                      <option value="Fire Response">Fire Response</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Badge ID / Code</label>
                  <div className="input-wrapper">
                    <input 
                      type="text"
                      className="input-control"
                      placeholder="EMS-8821A"
                      value={badgeNumber}
                      onChange={(e) => {
                        setBadgeNumber(e.target.value);
                        if (errors.badgeNumber) setErrors({ ...errors, badgeNumber: '' });
                      }}
                      style={{ 
                        paddingLeft: '2.5rem',
                        borderColor: errors.badgeNumber ? 'var(--primary)' : 'var(--border)',
                        boxShadow: errors.badgeNumber ? '0 0 0 4px rgba(239, 35, 60, 0.15)' : 'none'
                      }}
                    />
                    <FileText size={18} className="input-icon" />
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {errors.badgeNumber && (
                  <motion.span 
                    className="validation-error"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    style={{ marginTop: '0.5rem' }}
                  >
                    <AlertCircle size={14} /> {errors.badgeNumber}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password & Confirm Password Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'}
                className="input-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                style={errors.password ? { borderColor: 'var(--primary)', boxShadow: '0 0 0 4px rgba(239, 35, 60, 0.15)' } : {}}
              />
              <Lock size={18} className="input-icon" />
              <button 
                type="button" 
                className="input-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Password Strength Meter */}
            {password.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: '0.25rem' }}
              >
                <div className="strength-meter">
                  <div 
                    className="strength-bar" 
                    style={{ 
                      width: `${(strength.score / 5) * 100}%`, 
                      backgroundColor: strength.color 
                    }}
                  />
                </div>
                <div className="strength-text" style={{ color: strength.color }}>
                  {strength.text}
                </div>
              </motion.div>
            )}
            
            <AnimatePresence>
              {errors.password && (
                <motion.span 
                  className="validation-error"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <AlertCircle size={14} /> {errors.password}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-wrapper">
              <input 
                type={showConfirmPassword ? 'text' : 'password'}
                className="input-control"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                }}
                style={errors.confirmPassword ? { borderColor: 'var(--primary)', boxShadow: '0 0 0 4px rgba(239, 35, 60, 0.15)' } : {}}
              />
              <Lock size={18} className="input-icon" />
              <button 
                type="button" 
                className="input-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <AnimatePresence>
              {errors.confirmPassword && (
                <motion.span 
                  className="validation-error"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <AlertCircle size={14} /> {errors.confirmPassword}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Button */}
        <button 
          type="submit" 
          className="btn btn-solid btn-danger" 
          disabled={isSubmitting}
          style={{ 
            marginTop: '0.5rem', 
            justifyContent: 'center', 
            opacity: isSubmitting ? 0.8 : 1,
            pointerEvents: isSubmitting ? 'none' : 'auto'
          }}
        >
          {isSubmitting ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Provisioning Dispatch Node...
            </span>
          ) : (
            <>
              Deploy Node <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};
