# iColleague Virtual Employee Assistant

## Overview
iColleague is a modern, single-page web application that serves as a Virtual Employee Assistant. It provides employees with instant access to company information, services, processes, and contacts without requiring authentication.

## Features

### 🎯 Core Functionality
- **No Authentication Required** - Direct access for all employees
- **Natural Language Processing** - Understands employee questions and provides relevant answers
- **Multi-Category Support** - Handles Contacts, HR Policies, IT/Tech, Facilities, and Finance inquiries
- **Intelligent Search** - Matches queries to relevant information in the database
- **Quick Response Buttons** - Fast access to common follow-up questions

### 🎨 User Experience
- **Modern Interface** - Gradient color scheme with smooth animations
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Real-time Chat** - Message bubbles with smooth animations
- **Right Panel Info Display** - Shows contact details, processes, and policies
- **Recent Queries** - Sidebar tracks last 5 queries for quick re-access
- **Status Indicator** - Shows processing status and availability

### 📂 Project Structure

```
icolleague-app/
├── index.html              # Main single-page application
├── style.css              # All CSS styles and animations
├── script.js              # Chatbot engine and logic
│
├── data/
│   ├── contacts.json      # Employee directory (8 sample contacts)
│   ├── processes.json     # Company procedures (8 sample processes)
│   └── hr.json            # HR policies (10 sample policies)
│
└── assets/
    └── icons/             # Icon storage (optional)
```

## Getting Started

### Installation
1. Extract all files to a directory
2. No build process or dependencies required
3. No server setup needed - works as a standalone HTML file

### Running the Application
1. **Simple Method**: Open `index.html` directly in any modern web browser
   ```
   Double-click index.html
   ```

2. **With Local Server** (Recommended for better compatibility):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js
   npx http-server
   ```
   Then visit: `http://localhost:8000`

## Usage Guide

### Asking Questions
1. Type your question in the input field at the bottom
2. Press Enter or click the Send button (➤)
3. The assistant will process and provide relevant information

### Question Examples
- **Contacts**: "Who is the IT manager?" or "How do I reach payroll?"
- **HR/Policies**: "How do I request leave?" or "What's the sick leave policy?"
- **IT**: "How do I get VPN access?" or "I need a software license"
- **Facilities**: "How do I book a meeting room?"
- **Finance**: "How do I submit an expense report?"

### Quick Access Sidebar
- **All Services** - General overview of available services
- **Contacts** - Find employee contact information
- **HR & Policies** - Browse HR-related policies and procedures
- **IT & Tech** - IT support and access procedures
- **Facilities** - Office and facility services
- **Finance** - Financial policies and procedures

### Right Information Panel
- Click on any quick reply button to see more details
- Contact cards show detailed information including:
  - Name, role, and department
  - Email and phone contact
  - Expertise areas
  - Availability status

### Recent Queries
- Last 5 queries are saved and displayed in the left sidebar
- Click any recent query to run it again
- Queries are stored in browser's local storage

## Data Structure

### contacts.json
Contains employee directory with:
- Name, role, department
- Email, phone, availability
- Areas of expertise

Sample fields:
```json
{
  "name": "Sarah Johnson",
  "role": "HR Manager",
  "department": "Human Resources",
  "email": "sarah.johnson@company.com",
  "phone": "Ext. 4567",
  "availability": "Available",
  "expertise": ["HR Policies", "Leave Requests", "Benefits"]
}
```

### processes.json
Contains step-by-step procedures with:
- Process title and description
- Sequential steps
- Category and SLA (Service Level Agreement)
- Related contacts
- Form references

Sample fields:
```json
{
  "title": "VPN Access Request",
  "category": "IT",
  "steps": ["Submit form", "Get approval", "IT processes", "Receive setup"],
  "sla": "24 hours",
  "contacts": ["Michael Chen", "Robert Martinez"],
  "form": "IT-102"
}
```

### hr.json
Contains company policies with:
- Policy title and category
- Detailed description
- Bullet-point policy details
- Easy-to-understand guidelines

Sample fields:
```json
{
  "title": "Annual Leave Policy",
  "category": "Leave",
  "details": [
    "Employees entitled to 20 days annual leave per year",
    "Unused leave carries over (max 5 days)"
  ]
}
```

## Customization

### Adding New Employees/Contacts
1. Edit `data/contacts.json`
2. Add a new object with the required fields
3. Changes take effect immediately on next page load

### Adding New Processes
1. Edit `data/processes.json`
2. Add a new process object
3. Linking contacts by name will auto-populate expertise

### Adding New Policies
1. Edit `data/hr.json`
2. Add a new policy with category and details
3. The chatbot will automatically index the new policy

### Modifying Appearance
1. Edit `style.css` for colors and layout
2. Update color variables in :root section:
   ```css
   --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   --primary-color: #667eea;
   ```

## Technical Details

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Technology Stack
- Pure HTML5
- CSS3 with Flexbox and Grid
- Vanilla JavaScript (No frameworks)
- Local Storage for persistence

### Performance Features
- Loads all data on initialization
- Efficient DOM manipulation
- Smooth CSS animations
- Optimized scrolling behavior

## Features in Detail

### Natural Language Processing
The assistant understands queries by:
1. Converting to lowercase for case-insensitive matching
2. Looking for keyword patterns
3. Searching across all data sources
4. Returning the most relevant results

### Conversation Flow
1. User enters a question
2. Status changes to "Processing"
3. Query is analyzed for keywords
4. Relevant data is fetched and formatted
5. Response displayed with quick reply options
6. Query saved to recent history

### Responsive Design Breakpoints
- **Desktop** (1025px+): Full layout with 3 panels
- **Tablet** (769px-1024px): Adjusted sidebar width
- **Mobile** (480px-768px): Stacked layout
- **Small Mobile** (<480px): Minimized labels and panels

## Troubleshooting

### Data Not Loading
- Check that data/*.json files exist in the same directory
- Verify JSON syntax is valid
- Open browser console (F12) for error messages
- Try refreshing the page

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Ensure style.css is in the same directory as index.html
- Try a different browser to isolate issues

### Questions Not Being Recognized
- Try using keywords like "who", "how", "process", "policy"
- Check if the information exists in the data files
- The assistant provides suggestions if no exact match is found

## Future Enhancements
- Conversation context awareness
- Multi-language support
- Admin panel for data management
- Integration with actual employee systems
- Advanced search filters
- Chat history export
- Mobile app version

## Support
For issues or feature requests:
- Contact IT Help Desk: Ext. 3456
- Email: it-support@company.com
- Internal Wiki: [company-internal-wiki]

## License
Internal Use Only - Company Proprietary

---

**Version**: 1.0  
**Last Updated**: February 2026  
**Author**: Internal Development Team
