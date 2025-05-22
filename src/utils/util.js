/**
 * @param {Event} e - The input event containing name data.
 * @param {Object} field - React Hook Form field object.
 */
export const handleNameChange = ({ e, field }) => {
  e.target.value = e.target.value.trimStart().replace(/\s+/g, " ");
  const newValue = e.target.value;
  if (/^[a-zA-Z ]*$/.test(newValue)) {
    field.onChange(e);
  }
};

/**
 * @param {Event} e - The input event containing email data.
 * @param {Object} field - React Hook Form field object.
 */
export const handleEmailChange = ({ e, field }) => {
  if (e.target.value) {
    e.target.value = e.target.value.replace(/\s/g, "");
  }
  field.onChange(e);
};

/**
 * @param {Event} e - The input event containing phone number data.
 * @param {Object} field - React Hook Form field object.
 */
export const handlePhoneChange = ({ e, field }) => {
  e.target.value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
  field.onChange(e);
};

/**
 * @param {Event} e - The input event containing location data.
 * @param {Object} field - React Hook Form field object.
 */
export const handleLocationChange = ({ e, field }) => {
  e.target.value = e.target.value.trimStart().replace(/\s+/g, " ");
  field.onChange(e);
};

/**
 * @param {Event} e - The input event containing about section data.
 * @param {Object} field - React Hook Form field object.
 */
export const handleAboutChange = ({ e, field }) => {
  e.target.value = e.target.value.trimStart().replace(/\s+/g, " ");
  field.onChange(e);
};

/**
 * @param {Event} e - The input event containing password data.
 * @param {Object} field - React Hook Form field object.
 */
export const handlePasswordChange = ({ e, field }) => {
  if (e.target.value) {
    e.target.value = e.target.value.replace(/\s/g, "");
  }
  field.onChange(e);
};
