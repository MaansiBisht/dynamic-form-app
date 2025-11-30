export const formSchema = {
  title: "Employee Onboarding Form",
  description: "Please fill out the following information to complete your onboarding process.",
  fields: [
    {
      id: "firstName",
      type: "text",
      label: "First Name",
      placeholder: "Enter your first name",
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50
      }
    },
    {
      id: "lastName",
      type: "text",
      label: "Last Name",
      placeholder: "Enter your last name",
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50
      }
    },
    {
      id: "email",
      type: "text",
      label: "Email Address",
      placeholder: "Enter your email address",
      required: true,
      validation: {
        regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        regexMessage: "Please enter a valid email address"
      }
    },
    {
      id: "phone",
      type: "text",
      label: "Phone Number",
      placeholder: "Enter your phone number",
      required: true,
      validation: {
        regex: "^[0-9]{10}$",
        regexMessage: "Please enter a valid 10-digit phone number"
      }
    },
    {
      id: "age",
      type: "number",
      label: "Age",
      placeholder: "Enter your age",
      required: true,
      validation: {
        min: 18,
        max: 100
      }
    },
    {
      id: "department",
      type: "select",
      label: "Department",
      placeholder: "Select your department",
      required: true,
      options: [
        { value: "engineering", label: "Engineering" },
        { value: "marketing", label: "Marketing" },
        { value: "sales", label: "Sales" },
        { value: "hr", label: "Human Resources" },
        { value: "finance", label: "Finance" },
        { value: "operations", label: "Operations" }
      ]
    },
    {
      id: "skills",
      type: "multi-select",
      label: "Skills",
      placeholder: "Select your skills",
      required: true,
      options: [
        { value: "javascript", label: "JavaScript" },
        { value: "typescript", label: "TypeScript" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
        { value: "react", label: "React" },
        { value: "nodejs", label: "Node.js" },
        { value: "sql", label: "SQL" },
        { value: "aws", label: "AWS" }
      ],
      validation: {
        minSelected: 1,
        maxSelected: 5
      }
    },
    {
      id: "startDate",
      type: "date",
      label: "Start Date",
      placeholder: "Select your start date",
      required: true,
      validation: {
        minDate: "today"
      }
    },
    {
      id: "bio",
      type: "textarea",
      label: "Bio",
      placeholder: "Tell us about yourself",
      required: false,
      validation: {
        maxLength: 500
      }
    },
    {
      id: "remoteWork",
      type: "switch",
      label: "Remote Work",
      description: "I prefer to work remotely",
      required: false
    },
    {
      id: "termsAccepted",
      type: "switch",
      label: "Terms & Conditions",
      description: "I accept the terms and conditions",
      required: true
    }
  ]
};
