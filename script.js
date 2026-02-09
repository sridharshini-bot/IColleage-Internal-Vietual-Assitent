// ============================================
// iColleague Virtual Assistant - Chat Engine
// ============================================

class iColleagueAssistant {
    constructor() {
        this.contacts = [];
        this.processes = [];
        this.policies = [];
        this.conversationHistory = [];
        this.currentCategory = 'all';
        this.recentQueries = this.loadRecentQueries();
        
        this.initializeDOM();
        this.loadData();
        this.attachEventListeners();
        this.displayRecentQueries();
    }

    initializeDOM() {
        this.messagesArea = document.getElementById('messagesArea');
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.panelContent = document.getElementById('panelContent');
        this.panelClose = document.getElementById('panelClose');
        this.quickReplies = document.getElementById('quickReplies');
        this.recentQueriesContainer = document.getElementById('recentQueries');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.navButtons = document.querySelectorAll('.nav-btn');
    }

    attachEventListeners() {
        this.sendBtn.addEventListener('click', () => this.handleSendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSendMessage();
        });
        this.panelClose.addEventListener('click', () => this.clearPanel());
        
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.navButtons.forEach(b => b.classList.remove('active'));
                e.target.closest('.nav-btn').classList.add('active');
                this.currentCategory = e.target.closest('.nav-btn').dataset.category;
            });
        });
    }

    async loadData() {
        try {
            this.setStatus('Loading...');
            
            const [contactsRes, processesRes, hrRes] = await Promise.all([
                fetch('data/contacts.json'),
                fetch('data/processes.json'),
                fetch('data/hr.json')
            ]);

            this.contacts = await contactsRes.json();
            this.processes = await processesRes.json();
            this.policies = await hrRes.json();
            
            this.setStatus('Ready');
        } catch (error) {
            console.error('Data loading error:', error);
            this.addBotMessage('⚠️ Unable to load data. Please refresh the page.');
            this.setStatus('Error');
        }
    }

    handleSendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;

        this.addUserMessage(message);
        this.userInput.value = '';
        this.saveQuery(message);
        this.displayRecentQueries();

        this.setStatus('Processing');
        
        setTimeout(() => {
            this.processQuery(message);
            this.setStatus('Ready');
        }, 500);
    }

    processQuery(query) {
        const lowerQuery = query.toLowerCase();

        // Contact queries
        if (this.matchesPattern(lowerQuery, ['contact', 'who', 'phone', 'email', 'reach', 'department'])) {
            this.handleContactQuery(lowerQuery);
        }
        // Process/procedure queries
        else if (this.matchesPattern(lowerQuery, ['how', 'process', 'request', 'submit', 'access', 'procedure', 'step'])) {
            this.handleProcessQuery(lowerQuery);
        }
        // Policy queries
        else if (this.matchesPattern(lowerQuery, ['policy', 'eligible', 'entitled', 'allowed', 'rule', 'compliance', 'leave', 'benefits'])) {
            this.handlePolicyQuery(lowerQuery);
        }
        // General help
        else if (this.matchesPattern(lowerQuery, ['help', 'what can', 'service', 'available'])) {
            this.handleGeneralQuery();
        }
        else {
            this.handleGeneralQuery();
        }
    }

    matchesPattern(query, keywords) {
        return keywords.some(keyword => query.includes(keyword));
    }

    handleContactQuery(query) {
        let results = [];

        // Search by role or department
        const searchTerms = query.split(/\s+/);
        
        this.contacts.forEach(contact => {
            const roleMatch = searchTerms.some(term => 
                contact.role.toLowerCase().includes(term) || 
                contact.name.toLowerCase().includes(term)
            );
            const deptMatch = searchTerms.some(term => 
                contact.department.toLowerCase().includes(term)
            );
            
            if (roleMatch || deptMatch) {
                results.push(contact);
            }
        });

        if (results.length === 0) {
            // Search by expertise
            results = this.contacts.filter(contact =>
                searchTerms.some(term =>
                    contact.expertise.some(exp => exp.toLowerCase().includes(term))
                )
            );
        }

        if (results.length === 0) {
            this.addBotMessage('I couldn\'t find a specific contact. Here are some key contacts:\n\n' + 
                this.contacts.slice(0, 3)
                    .map(c => `• **${c.name}** - ${c.role}\n  ${c.department}\n  ${c.email}`)
                    .join('\n\n'));
            this.showQuickReplies(['IT Support', 'HR Manager', 'Facilities']);
        } else {
            this.addBotMessage(`Found ${results.length} matching contact${results.length > 1 ? 's' : ''}:`);
            results.forEach(contact => this.displayContactCard(contact));
            this.showQuickReplies(['Show more', 'IT Support', 'Facilities']);
        }
    }

    handleProcessQuery(query) {
        let results = this.processes.filter(process =>
            process.title.toLowerCase().includes(query) ||
            process.description.toLowerCase().includes(query) ||
            process.steps.some(step => step.toLowerCase().includes(query)) ||
            process.category.toLowerCase().includes(query)
        );

        if (results.length === 0) {
            this.addBotMessage('I didn\'t find that specific process. Popular processes include:\n\n' +
                this.processes.slice(0, 4)
                    .map(p => `• **${p.title}** - ${p.category}`)
                    .join('\n'));
            this.showQuickReplies(['VPN Access', 'Leave Request', 'Software License']);
        } else {
            this.addBotMessage(`Found ${results.length} process${results.length > 1 ? 'es' : ''}:`);
            results.forEach(process => this.displayProcessCard(process));
            this.showQuickReplies(['View details', 'Download form', 'Contact support']);
        }
    }

    handlePolicyQuery(query) {
        let results = this.policies.filter(policy =>
            policy.title.toLowerCase().includes(query) ||
            policy.description.toLowerCase().includes(query) ||
            policy.category.toLowerCase().includes(query) ||
            policy.details.some(detail => detail.toLowerCase().includes(query))
        );

        if (results.length === 0) {
            this.addBotMessage('I couldn\'t find that policy. Here are our main policy categories:\n\n' +
                [...new Set(this.policies.map(p => p.category))]
                    .map(cat => `• ${cat}`)
                    .join('\n'));
            this.showQuickReplies(['Leave Policy', 'Work Arrangements', 'Benefits']);
        } else {
            this.addBotMessage(`Found policy information:`);
            results.forEach(policy => this.displayPolicyCard(policy));
            this.showQuickReplies(['More details', 'Related policies', 'Contact HR']);
        }
    }

    handleGeneralQuery() {
        const response = `I'm iColleague, your Virtual Employee Assistant! I can help you with:

**👤 Contacts & Departments**
• Find employee details and contact information
• Locate department managers and specialists

**📋 HR & Policies**
• Leave policies and eligibility
• Benefits and compensation information
• Compliance and conduct rules

**💻 IT & Technology**
• VPN access and software licenses
• Hardware requests and support
• Email and system access

**🏢 Facilities**
• Meeting room bookings
• Office access cards
• Maintenance and parking

**💰 Finance**
• Expense reimbursement process
• Budget approvals
• Payroll information

Just ask me anything! For example: "How do I request leave?" or "Who handles payroll?"`;

        this.addBotMessage(response);
        this.showQuickReplies(['HR Policies', 'IT Support', 'Contact Directory']);
    }

    displayContactCard(contact) {
        const html = `
            <div class="contact-card">
                <div class="contact-header">
                    <div class="contact-avatar">${contact.name.charAt(0)}</div>
                    <div class="contact-info">
                        <div class="contact-name">${contact.name}</div>
                        <div class="contact-role">${contact.role}</div>
                        <div class="contact-availability ${contact.availability === 'Available' ? '' : 'busy'}">
                            • ${contact.availability}
                        </div>
                    </div>
                </div>
                <div class="contact-detail">
                    <span class="contact-detail-label">Department</span>
                    <span class="contact-detail-value">${contact.department}</span>
                </div>
                <div class="contact-detail">
                    <span class="contact-detail-label">Email</span>
                    <span class="contact-detail-value">${contact.email}</span>
                </div>
                <div class="contact-detail">
                    <span class="contact-detail-label">Phone</span>
                    <span class="contact-detail-value">${contact.phone}</span>
                </div>
                <div class="expertise">
                    <span class="expertise-label">Expertise Areas</span>
                    <div class="expertise-tags">
                        ${contact.expertise.map(exp => `<span class="expertise-tag">${exp}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;

        const messageGroup = document.createElement('div');
        messageGroup.className = 'message-group bot-message';
        messageGroup.innerHTML = `
            <div class="message-avatar bot">👥</div>
            <div class="message-bubble">${html}</div>
        `;
        this.messagesArea.appendChild(messageGroup);
        this.scrollToBottom();
    }

    displayProcessCard(process) {
        const stepsHtml = process.steps
            .map((step, idx) => `
                <div class="process-step">
                    <div class="step-number">${idx + 1}</div>
                    <div class="step-content">${step}</div>
                </div>
            `).join('');

        const contactsHtml = process.contacts
            .map(contactName => {
                const contact = this.contacts.find(c => 
                    c.name.includes(contactName) || c.role.includes(contactName)
                );
                return contact ? `<span class="expertise-tag">${contact.name}</span>` : '';
            }).join('');

        const html = `
            <div class="process-card">
                <div class="process-title">${process.title}</div>
                <div class="process-description">${process.description}</div>
                <div class="process-steps">${stepsHtml}</div>
                <div class="process-meta">
                    <div class="process-meta-item">
                        <span class="process-meta-label">Category</span>
                        <span class="process-meta-value">${process.category}</span>
                    </div>
                    <div class="process-meta-item">
                        <span class="process-meta-label">SLA</span>
                        <span class="process-meta-value">${process.sla}</span>
                    </div>
                    <div class="process-meta-item">
                        <span class="process-meta-label">Form</span>
                        <span class="process-meta-value">${process.form}</span>
                    </div>
                    ${contactsHtml ? `<div class="process-meta-item">
                        <span class="process-meta-label">Contact</span>
                    </div>
                    <div class="expertise-tags" style="margin-top: 0.5rem;">
                        ${contactsHtml}
                    </div>` : ''}
                </div>
            </div>
        `;

        const messageGroup = document.createElement('div');
        messageGroup.className = 'message-group bot-message';
        messageGroup.innerHTML = `
            <div class="message-avatar bot">📋</div>
            <div class="message-bubble">${html}</div>
        `;
        this.messagesArea.appendChild(messageGroup);
        this.scrollToBottom();
    }

    displayPolicyCard(policy) {
        const detailsHtml = policy.details
            .map(detail => `<li>${detail}</li>`)
            .join('');

        const html = `
            <div class="policy-card">
                <div class="policy-category">${policy.category}</div>
                <div class="policy-title">${policy.title}</div>
                <div class="policy-description">${policy.description}</div>
                <div class="policy-details">
                    <ul>${detailsHtml}</ul>
                </div>
            </div>
        `;

        const messageGroup = document.createElement('div');
        messageGroup.className = 'message-group bot-message';
        messageGroup.innerHTML = `
            <div class="message-avatar bot">📄</div>
            <div class="message-bubble">${html}</div>
        `;
        this.messagesArea.appendChild(messageGroup);
        this.scrollToBottom();
    }

    addUserMessage(text) {
        const messageGroup = document.createElement('div');
        messageGroup.className = 'message-group user-message';
        messageGroup.innerHTML = `
            <div class="message-avatar user">👤</div>
            <div class="message-bubble"><p>${this.escapeHtml(text)}</p></div>
        `;
        this.messagesArea.appendChild(messageGroup);
        this.scrollToBottom();
    }

    addBotMessage(text) {
        const messageGroup = document.createElement('div');
        messageGroup.className = 'message-group bot-message';
        
        // Convert markdown-like formatting
        const formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '</p><p>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');

        messageGroup.innerHTML = `
            <div class="message-avatar bot">👥</div>
            <div class="message-bubble">${formattedText}</div>
        `;
        this.messagesArea.appendChild(messageGroup);
        this.scrollToBottom();
    }

    showQuickReplies(replies) {
        this.quickReplies.innerHTML = '';
        replies.forEach(reply => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply-btn';
            btn.textContent = reply;
            btn.addEventListener('click', () => {
                this.userInput.value = reply;
                this.handleSendMessage();
            });
            this.quickReplies.appendChild(btn);
        });
        this.quickReplies.style.display = 'flex';
        this.scrollToBottom();
    }

    clearPanel() {
        this.panelContent.innerHTML = `
            <div class="empty-state">
                <p>💡 Ask a question or click on a quick access button to see details here</p>
            </div>
        `;
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
        }, 0);
    }

    setStatus(status) {
        this.statusIndicator.textContent = status;
        this.statusIndicator.classList.toggle('processing', status === 'Processing');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveQuery(query) {
        if (!this.recentQueries.includes(query)) {
            this.recentQueries.unshift(query);
            if (this.recentQueries.length > 5) {
                this.recentQueries.pop();
            }
            localStorage.setItem('recentQueries', JSON.stringify(this.recentQueries));
        }
    }

    loadRecentQueries() {
        const saved = localStorage.getItem('recentQueries');
        return saved ? JSON.parse(saved) : [];
    }

    displayRecentQueries() {
        if (this.recentQueries.length === 0) {
            this.recentQueriesContainer.innerHTML = '<div class="empty-state">No recent queries</div>';
            return;
        }

        this.recentQueriesContainer.innerHTML = this.recentQueries
            .map(query => `
                <div class="recent-query" onclick="window.assistant.selectRecentQuery('${this.escapeHtml(query)}')">
                    ${this.escapeHtml(query)}
                </div>
            `)
            .join('');
    }

    selectRecentQuery(query) {
        this.userInput.value = query;
        this.handleSendMessage();
    }
}

// Initialize the assistant when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.assistant = new iColleagueAssistant();
});
