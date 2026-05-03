import React from 'react';

const SectionRule = ({ label, className = '' }) => (
  <div className={`ns-section-rule ${className}`.trim()}>
    <span />
    <div>{label}</div>
    <span />
  </div>
);

export default SectionRule;
