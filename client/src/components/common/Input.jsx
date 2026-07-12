import React, { useState, forwardRef } from 'react';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  helperText,
  errorMessage,
  required = false,
  disabled = false,
  className = '',
  icon: LeftIcon = null,
  rightIcon: RightIcon = null,
  multiline = false,
  rows = 3,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  // Outer container and wrapper styling
  const wrapperClass = 'flex flex-col w-full text-left space-y-1.5';
  
  // Input baseline style
  const baseInputStyle = 'w-full px-4 py-2.5 bg-slate-50 border text-slate-800 placeholder-slate-400 rounded-xl text-sm transition-all focus:outline-none focus:bg-white focus:ring-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed';
  
  // Conditionals for error or normal state
  const stateStyle = errorMessage
    ? 'border-rose-350 focus:border-rose-500 focus:ring-rose-500/20'
    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20';

  // Left/Right padding corrections if icons exist
  const paddingStyle = `
    ${LeftIcon ? 'pl-11' : ''} 
    ${(RightIcon || isPassword) ? 'pr-11' : ''}
  `.trim();

  return (
    <div className={`${wrapperClass} ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider select-none">
          {label}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
      )}

      {/* Field wrapper */}
      <div className="relative w-full flex items-center">
        {/* Left Icon */}
        {LeftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <LeftIcon className="w-5 h-5" />
          </div>
        )}

        {/* Textarea or Input render */}
        {multiline || type === 'textarea' ? (
          <textarea
            ref={ref}
            rows={rows}
            disabled={disabled}
            placeholder={placeholder}
            className={`${baseInputStyle} ${stateStyle} ${paddingStyle} resize-y min-h-[80px]`}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            placeholder={placeholder}
            className={`${baseInputStyle} ${stateStyle} ${paddingStyle}`}
            {...props}
          />
        )}

        {/* Right Icon / Password eye toggle */}
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 focus:outline-none hover:bg-slate-100 transition-colors"
            title={showPassword ? 'Hide Password' : 'Show Password'}
          >
            {showPassword ? <RiEyeOffLine className="w-[18px] h-[18px]" /> : <RiEyeLine className="w-[18px] h-[18px]" />}
          </button>
        ) : (
          RightIcon && (
            <div className="absolute right-3.5 text-slate-400 pointer-events-none">
              <RightIcon className="w-5 h-5" />
            </div>
          )
        )}
      </div>

      {/* Error Message or Helper Text */}
      {errorMessage ? (
        <p className="text-xs font-semibold text-rose-500 select-none">
          {errorMessage}
        </p>
      ) : (
        helperText && (
          <p className="text-xs text-slate-400 select-none">
            {helperText}
          </p>
        )
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
