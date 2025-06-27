/**
 * Formula PM Email Service
 * Comprehensive email notification system with templates and delivery tracking
 */

const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const cacheService = require('./cacheService');
const auditService = require('./auditService');

class EmailService {
  constructor() {
    this.transporter = null;
    this.templates = new Map();
    this.config = {
      smtp: {
        host: process.env.SMTP_HOST || 'localhost',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      },
      from: {
        name: process.env.EMAIL_FROM_NAME || 'Formula PM',
        address: process.env.EMAIL_FROM_ADDRESS || 'noreply@formulapm.com'
      },
      templatePath: path.join(__dirname, '../templates/email'),
      cacheTTL: 3600, // 1 hour
      retryAttempts: 3,
      retryDelay: 5000 // 5 seconds
    };
    
    this.stats = {
      sent: 0,
      failed: 0,
      bounced: 0,
      lastReset: Date.now()
    };

    this.initialize();
  }

  /**
   * Initialize email service
   */
  async initialize() {
    try {
      await this.createTransporter();
      await this.loadTemplates();
      console.log('✅ Email service initialized');
    } catch (error) {
      console.error('❌ Email service initialization error:', error);
    }
  }

  /**
   * Create email transporter
   */
  async createTransporter() {
    try {
      this.transporter = nodemailer.createTransport(this.config.smtp);
      
      // Verify connection
      await this.transporter.verify();
      console.log('✅ SMTP connection verified');
    } catch (error) {
      console.error('❌ SMTP connection error:', error);
      // Continue without email if SMTP is not available
      this.transporter = null;
    }
  }

  /**
   * Load email templates
   */
  async loadTemplates() {
    try {
      const templateDir = this.config.templatePath;
      
      // Ensure template directory exists
      try {
        await fs.access(templateDir);
      } catch {
        // Create template directory and default templates
        await this.createDefaultTemplates();
      }

      const templateFiles = await fs.readdir(templateDir);
      
      for (const file of templateFiles) {
        if (file.endsWith('.hbs')) {
          const templateName = path.basename(file, '.hbs');
          const templateContent = await fs.readFile(path.join(templateDir, file), 'utf8');
          const compiledTemplate = handlebars.compile(templateContent);
          this.templates.set(templateName, compiledTemplate);
        }
      }

      console.log(`✅ Loaded ${this.templates.size} email templates`);
    } catch (error) {
      console.error('❌ Load templates error:', error);
    }
  }

  /**
   * Create default email templates
   */
  async createDefaultTemplates() {
    try {
      const templateDir = this.config.templatePath;
      await fs.mkdir(templateDir, { recursive: true });

      const defaultTemplates = {
        'task-assigned': `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Task Assignment - Formula PM</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
        .header { border-bottom: 2px solid #3B82F6; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #1F2937; font-size: 24px; margin: 0; }
        .content { color: #374151; line-height: 1.6; }
        .task-details { background: #F3F4F6; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">Task Assignment</h1>
        </div>
        <div class="content">
            <p>Hello {{assigneeName}},</p>
            <p>You have been assigned a new task in Formula PM.</p>
            
            <div class="task-details">
                <h3>Task Details:</h3>
                <p><strong>Task:</strong> {{taskName}}</p>
                <p><strong>Project:</strong> {{projectName}}</p>
                <p><strong>Assigned by:</strong> {{assignerName}}</p>
                {{#if dueDate}}<p><strong>Due Date:</strong> {{dueDate}}</p>{{/if}}
                <p><strong>Priority:</strong> {{priority}}</p>
                {{#if description}}<p><strong>Description:</strong> {{description}}</p>{{/if}}
            </div>
            
            <a href="{{taskUrl}}" class="button">View Task</a>
            
            <p>Please log in to Formula PM to view the full task details and get started.</p>
        </div>
        <div class="footer">
            <p>This is an automated message from Formula PM. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`,

        'project-update': `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Project Update - Formula PM</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
        .header { border-bottom: 2px solid #10B981; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #1F2937; font-size: 24px; margin: 0; }
        .content { color: #374151; line-height: 1.6; }
        .update-details { background: #F0FDF4; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #10B981; }
        .button { display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">Project Update</h1>
        </div>
        <div class="content">
            <p>Hello {{userName}},</p>
            <p>There has been an update to project "{{projectName}}".</p>
            
            <div class="update-details">
                <h3>Update Summary:</h3>
                <p>{{updateMessage}}</p>
                {{#if changes}}
                <ul>
                {{#each changes}}
                    <li>{{this}}</li>
                {{/each}}
                </ul>
                {{/if}}
                <p><strong>Updated by:</strong> {{updatedBy}}</p>
                <p><strong>Date:</strong> {{updateDate}}</p>
            </div>
            
            <a href="{{projectUrl}}" class="button">View Project</a>
        </div>
        <div class="footer">
            <p>This is an automated message from Formula PM. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`,

        'deadline-reminder': `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Deadline Reminder - Formula PM</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
        .header { border-bottom: 2px solid #F59E0B; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #1F2937; font-size: 24px; margin: 0; }
        .content { color: #374151; line-height: 1.6; }
        .warning { background: #FEF3C7; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #F59E0B; }
        .urgent { background: #FEE2E2; border-left-color: #EF4444; }
        .button { display: inline-block; background: #F59E0B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">⏰ Deadline Reminder</h1>
        </div>
        <div class="content">
            <p>Hello {{assigneeName}},</p>
            <p>This is a reminder about an upcoming deadline for your task.</p>
            
            <div class="warning {{#if isUrgent}}urgent{{/if}}">
                <h3>{{#if isUrgent}}🚨 URGENT: {{/if}}Task Due {{timeFrame}}</h3>
                <p><strong>Task:</strong> {{taskName}}</p>
                <p><strong>Project:</strong> {{projectName}}</p>
                <p><strong>Due Date:</strong> {{dueDate}}</p>
                <p><strong>Priority:</strong> {{priority}}</p>
                {{#if description}}<p><strong>Description:</strong> {{description}}</p>{{/if}}
            </div>
            
            <a href="{{taskUrl}}" class="button">View Task</a>
            
            <p>Please ensure this task is completed on time to keep the project on schedule.</p>
        </div>
        <div class="footer">
            <p>This is an automated message from Formula PM. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`,

        'system-alert': `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>System Alert - Formula PM</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
        .header { border-bottom: 2px solid #EF4444; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #1F2937; font-size: 24px; margin: 0; }
        .content { color: #374151; line-height: 1.6; }
        .alert { background: #FEE2E2; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #EF4444; }
        .button { display: inline-block; background: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">🚨 System Alert</h1>
        </div>
        <div class="content">
            <p>Hello {{userName}},</p>
            <p>This is an important system notification that requires your attention.</p>
            
            <div class="alert">
                <h3>Alert Details:</h3>
                <p><strong>Type:</strong> {{alertType}}</p>
                <p><strong>Severity:</strong> {{severity}}</p>
                <p><strong>Message:</strong> {{alertMessage}}</p>
                <p><strong>Time:</strong> {{alertTime}}</p>
                {{#if actionRequired}}<p><strong>Action Required:</strong> {{actionRequired}}</p>{{/if}}
            </div>
            
            {{#if actionUrl}}<a href="{{actionUrl}}" class="button">Take Action</a>{{/if}}
        </div>
        <div class="footer">
            <p>This is an automated message from Formula PM. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`
      };

      for (const [templateName, content] of Object.entries(defaultTemplates)) {
        await fs.writeFile(path.join(templateDir, `${templateName}.hbs`), content, 'utf8');
      }

      console.log('✅ Created default email templates');
    } catch (error) {
      console.error('❌ Create default templates error:', error);
    }
  }

  /**
   * Send email with template
   */
  async sendEmail(options) {
    try {
      const {
        to,
        subject,
        template,
        data = {},
        attachments = [],
        priority = 'normal'
      } = options;

      if (!this.transporter) {
        console.log('⚠️ Email service not available, skipping email send');
        return { success: false, reason: 'No email transporter' };
      }

      // Get compiled template
      const compiledTemplate = this.templates.get(template);
      if (!compiledTemplate) {
        throw new Error(`Email template '${template}' not found`);
      }

      // Generate email content
      const htmlContent = compiledTemplate(data);
      
      // Prepare email options
      const mailOptions = {
        from: `"${this.config.from.name}" <${this.config.from.address}>`,
        to,
        subject,
        html: htmlContent,
        attachments,
        priority: priority === 'high' ? 'high' : 'normal'
      };

      // Send email with retry logic
      const result = await this.sendWithRetry(mailOptions);
      
      if (result.success) {
        this.stats.sent++;
        
        // Log email sent
        await auditService.logSystemEvent({
          event: 'email_sent',
          description: `Email sent to ${to}: ${subject}`,
          metadata: {
            to,
            subject,
            template,
            messageId: result.messageId
          }
        });
      } else {
        this.stats.failed++;
      }

      return result;
    } catch (error) {
      console.error('❌ Send email error:', error);
      this.stats.failed++;
      throw error;
    }
  }

  /**
   * Send email with retry logic
   */
  async sendWithRetry(mailOptions, attempt = 1) {
    try {
      const info = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: info.messageId,
        response: info.response
      };
    } catch (error) {
      console.error(`❌ Email send attempt ${attempt} failed:`, error);
      
      if (attempt < this.config.retryAttempts) {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt));
        return await this.sendWithRetry(mailOptions, attempt + 1);
      } else {
        return {
          success: false,
          error: error.message,
          attempts: attempt
        };
      }
    }
  }

  /**
   * Send task assignment email
   */
  async sendTaskAssignmentEmail(taskData, assigneeData, assignerData) {
    try {
      const templateData = {
        assigneeName: `${assigneeData.firstName} ${assigneeData.lastName}`,
        taskName: taskData.name,
        projectName: taskData.projectName,
        assignerName: `${assignerData.firstName} ${assignerData.lastName}`,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toLocaleDateString() : null,
        priority: taskData.priority,
        description: taskData.description,
        taskUrl: `${process.env.FRONTEND_URL}/tasks/${taskData.id}`
      };

      return await this.sendEmail({
        to: assigneeData.email,
        subject: `New Task Assignment: ${taskData.name}`,
        template: 'task-assigned',
        data: templateData,
        priority: taskData.priority === 'urgent' ? 'high' : 'normal'
      });
    } catch (error) {
      console.error('❌ Send task assignment email error:', error);
      throw error;
    }
  }

  /**
   * Send project update email
   */
  async sendProjectUpdateEmail(projectData, userData, updateData) {
    try {
      const templateData = {
        userName: `${userData.firstName} ${userData.lastName}`,
        projectName: projectData.name,
        updateMessage: updateData.message,
        changes: updateData.changes || [],
        updatedBy: updateData.updatedByName,
        updateDate: new Date().toLocaleDateString(),
        projectUrl: `${process.env.FRONTEND_URL}/projects/${projectData.id}`
      };

      return await this.sendEmail({
        to: userData.email,
        subject: `Project Update: ${projectData.name}`,
        template: 'project-update',
        data: templateData
      });
    } catch (error) {
      console.error('❌ Send project update email error:', error);
      throw error;
    }
  }

  /**
   * Send deadline reminder email
   */
  async sendDeadlineReminderEmail(taskData, assigneeData, urgency = 'medium') {
    try {
      const dueDate = new Date(taskData.dueDate);
      const now = new Date();
      const timeDiff = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      
      let timeFrame = 'soon';
      if (timeDiff <= 0) {
        timeFrame = 'today';
      } else if (timeDiff === 1) {
        timeFrame = 'tomorrow';
      } else if (timeDiff <= 7) {
        timeFrame = `in ${timeDiff} days`;
      }

      const templateData = {
        assigneeName: `${assigneeData.firstName} ${assigneeData.lastName}`,
        taskName: taskData.name,
        projectName: taskData.projectName,
        dueDate: dueDate.toLocaleDateString(),
        priority: taskData.priority,
        description: taskData.description,
        timeFrame,
        isUrgent: urgency === 'high' || timeDiff <= 1,
        taskUrl: `${process.env.FRONTEND_URL}/tasks/${taskData.id}`
      };

      return await this.sendEmail({
        to: assigneeData.email,
        subject: `⏰ Deadline Reminder: ${taskData.name}`,
        template: 'deadline-reminder',
        data: templateData,
        priority: urgency === 'high' ? 'high' : 'normal'
      });
    } catch (error) {
      console.error('❌ Send deadline reminder email error:', error);
      throw error;
    }
  }

  /**
   * Send system alert email
   */
  async sendSystemAlertEmail(userData, alertData) {
    try {
      const templateData = {
        userName: `${userData.firstName} ${userData.lastName}`,
        alertType: alertData.type,
        severity: alertData.severity,
        alertMessage: alertData.message,
        alertTime: new Date().toLocaleString(),
        actionRequired: alertData.actionRequired,
        actionUrl: alertData.actionUrl
      };

      return await this.sendEmail({
        to: userData.email,
        subject: `🚨 System Alert: ${alertData.type}`,
        template: 'system-alert',
        data: templateData,
        priority: 'high'
      });
    } catch (error) {
      console.error('❌ Send system alert email error:', error);
      throw error;
    }
  }

  /**
   * Send batch emails
   */
  async sendBatchEmails(emailList) {
    try {
      const results = [];
      const batchSize = 10; // Send in batches to avoid rate limiting
      
      for (let i = 0; i < emailList.length; i += batchSize) {
        const batch = emailList.slice(i, i + batchSize);
        const batchPromises = batch.map(emailData => 
          this.sendEmail(emailData).catch(error => ({
            success: false,
            error: error.message,
            emailData
          }))
        );
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Small delay between batches
        if (i + batchSize < emailList.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      console.log(`📧 Batch email complete: ${successful} sent, ${failed} failed`);
      
      return {
        total: results.length,
        successful,
        failed,
        results
      };
    } catch (error) {
      console.error('❌ Send batch emails error:', error);
      throw error;
    }
  }

  /**
   * Send notification digest email
   */
  async sendNotificationDigest(userData, digestData) {
    try {
      // This would use a digest template (to be created)
      const subject = `Daily Digest - ${digestData.totalNotifications} notifications`;
      
      // For now, use a simple HTML format
      const htmlContent = `
        <h2>Formula PM Daily Digest</h2>
        <p>Hello ${userData.firstName},</p>
        <p>You have ${digestData.totalNotifications} notifications from the past day:</p>
        <ul>
          ${Object.entries(digestData.groupedNotifications).map(([type, notifications]) => 
            `<li>${type}: ${notifications.length} notifications</li>`
          ).join('')}
        </ul>
        <p><a href="${process.env.FRONTEND_URL}/notifications">View all notifications</a></p>
      `;

      const mailOptions = {
        from: `"${this.config.from.name}" <${this.config.from.address}>`,
        to: userData.email,
        subject,
        html: htmlContent
      };

      return await this.sendWithRetry(mailOptions);
    } catch (error) {
      console.error('❌ Send notification digest error:', error);
      throw error;
    }
  }

  /**
   * Get email statistics
   */
  getEmailStats() {
    return {
      ...this.stats,
      successRate: this.stats.sent + this.stats.failed > 0 
        ? Math.round((this.stats.sent / (this.stats.sent + this.stats.failed)) * 100) 
        : 0,
      uptime: Date.now() - this.stats.lastReset,
      templatesLoaded: this.templates.size,
      transporterReady: !!this.transporter
    };
  }

  /**
   * Reset email statistics
   */
  resetStats() {
    this.stats = {
      sent: 0,
      failed: 0,
      bounced: 0,
      lastReset: Date.now()
    };
  }

  /**
   * Test email configuration
   */
  async testEmailConfiguration() {
    try {
      if (!this.transporter) {
        return {
          success: false,
          message: 'Email transporter not configured'
        };
      }

      // Verify SMTP connection
      await this.transporter.verify();
      
      // Send test email to configured address
      const testEmail = process.env.TEST_EMAIL_ADDRESS;
      if (testEmail) {
        const result = await this.sendEmail({
          to: testEmail,
          subject: 'Formula PM Email Service Test',
          template: 'system-alert',
          data: {
            userName: 'Test User',
            alertType: 'Configuration Test',
            severity: 'info',
            alertMessage: 'This is a test email to verify email service configuration.',
            alertTime: new Date().toLocaleString()
          }
        });
        
        return {
          success: result.success,
          message: result.success ? 'Test email sent successfully' : 'Test email failed',
          details: result
        };
      } else {
        return {
          success: true,
          message: 'SMTP connection verified (no test email sent - TEST_EMAIL_ADDRESS not configured)'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Email configuration test failed: ${error.message}`,
        error: error.code
      };
    }
  }
}

module.exports = new EmailService();