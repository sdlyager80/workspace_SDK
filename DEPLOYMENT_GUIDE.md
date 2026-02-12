# ServiceNow SDK Deployment Guide

Complete guide for deploying the Insurance Policy Servicing application to ServiceNow.

## 📋 Prerequisites

### 1. ServiceNow Instance

You need a ServiceNow instance. Options:

**Option A: Personal Developer Instance (PDI) - FREE**
1. Go to https://developer.servicenow.com/
2. Create an account
3. Request a PDI (takes ~5 minutes)
4. You'll receive instance URL like: `https://dev12345.service-now.com`
5. Note: PDI hibernates after inactivity - wake it from developer portal

**Option B: Company Instance**
- Use your organization's ServiceNow instance
- Need admin or developer role

### 2. ServiceNow CLI

Install globally:

```bash
npm install -g @servicenow/cli
```

Verify installation:

```bash
snc --version
```

### 3. Node.js

Ensure Node.js >= 18:

```bash
node --version
```

## 🔧 Initial Setup

### Step 1: Clone and Install

```bash
git clone https://github.com/sdlyager80/workspace_SDK.git
cd workspace_SDK
npm install
```

### Step 2: Configure ServiceNow CLI

Create a profile for your instance:

```bash
snc configure profile set --profile my-dev-instance
```

You'll be prompted for:

```
Instance URL: https://dev12345.service-now.com
Username: admin
Password: your-password
```

**Security Note**: Credentials are stored encrypted in `~/.snc/config.json`

### Step 3: Test Connection

```bash
snc instance info --profile my-dev-instance
```

You should see your instance details.

## 🚀 Deployment Methods

### Method 1: CLI Deployment (Fastest)

**Best for**: Quick deployments, CI/CD automation

```bash
# 1. Build the application
npm run build

# 2. Deploy to ServiceNow
npm run deploy

# Or combine both steps
npm run build && npm run deploy
```

**What happens:**
- Compiles UI components
- Creates/updates table definitions
- Pushes to ServiceNow instance
- Activates application

**Time**: ~2-3 minutes

---

### Method 2: ServiceNow IDE in VS Code

**Best for**: Active development with live sync

#### Setup:

1. **Install VS Code Extension**
   - Open VS Code
   - Extensions → Search "ServiceNow"
   - Install "ServiceNow Extension Pack"

2. **Connect to Instance**
   - Open Command Palette: `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
   - Select: `ServiceNow: Connect to Instance`
   - Enter instance URL and credentials
   - Select this project folder

3. **Initial Sync**
   - Right-click on project root
   - Select: `ServiceNow: Push Application to Instance`

#### Ongoing Development:

- Make changes to files
- Auto-syncs to ServiceNow (or right-click → Push)
- See changes immediately in browser

**Time**: Initial setup 10 minutes, then instant syncs

---

### Method 3: Import via Update Set

**Best for**: Moving between instances (Dev → QA → Prod)

#### Export from Source Instance:

```bash
# Using CLI
snc ui-component export --name "x_dxcis_ins_pol" --output ./export/

# Or in ServiceNow:
# Navigate to: System Update Sets → Default
# Right-click on update set → Export to XML
```

#### Import to Target Instance:

1. **Upload Update Set**
   - In ServiceNow, navigate to: **System Update Sets → Retrieved Update Sets**
   - Click: **Import Update Set from XML**
   - Upload the exported file

2. **Preview Update Set**
   - Click on imported update set
   - Click: **Preview Update Set**
   - Review for conflicts
   - Resolve any issues

3. **Commit Update Set**
   - Click: **Commit Update Set**
   - Application is now deployed

**Time**: ~10 minutes (including review)

---

## 🗄️ Database Setup

### Create the Policy Table

The table definition is in `src/tables/x_dxcis_ins_pol_policy.json` and should be created automatically during deployment.

**Verify table creation:**

1. In ServiceNow, navigate to: **System Definition → Tables**
2. Search for: `x_dxcis_ins_pol_policy`
3. Should see: "Insurance Policy" table

**Manual creation (if needed):**

```javascript
// Run in ServiceNow Scripts - Background

// This is done automatically, but here's how to verify/recreate
var creator = new GlideTableCreator('x_dxcis_ins_pol_policy', 'Insurance Policy');
creator.setExtends('task'); // Extends task table
creator.execute();
```

### Load Sample Data

**Option A: Via Script**

1. Navigate to: **System Definition → Scripts - Background**
2. Paste this script:

```javascript
// Create sample life insurance policy
var policy1 = new GlideRecord('x_dxcis_ins_pol_policy');
policy1.initialize();
policy1.policy_number = 'LIFE-2024-001';
policy1.policy_type = 'LIFE';
policy1.status = 'ACTIVE';
policy1.product_name = 'Whole Life Premium Plus';
policy1.issue_date = '2020-01-15';
policy1.effective_date = '2020-01-15';
policy1.face_amount = 500000;
policy1.cash_value = 25000;
policy1.premium_amount = 250;
policy1.premium_frequency = 'MONTHLY';
policy1.owner_first_name = 'John';
policy1.owner_middle_name = 'A';
policy1.owner_last_name = 'Smith';
policy1.owner_dob = '1980-03-15';
policy1.owner_ssn_last4 = '1234';
policy1.owner_email = 'john.smith@email.com';
policy1.owner_phone = '555-0123';
policy1.mailing_street1 = '123 Main Street';
policy1.mailing_city = 'New York';
policy1.mailing_state = 'NY';
policy1.mailing_zip = '10001';
policy1.mailing_country = 'USA';
policy1.return_mail_flag = false;
policy1.insert();

// Create sample annuity policy
var policy2 = new GlideRecord('x_dxcis_ins_pol_policy');
policy2.initialize();
policy2.policy_number = 'ANN-2024-002';
policy2.policy_type = 'ANNUITY';
policy2.status = 'ACTIVE';
policy2.product_name = 'Fixed Annuity Gold';
policy2.issue_date = '2019-06-01';
policy2.effective_date = '2019-06-01';
policy2.cash_value = 150000;
policy2.premium_amount = 500;
policy2.premium_frequency = 'QUARTERLY';
policy2.owner_first_name = 'Jane';
policy2.owner_last_name = 'Doe';
policy2.owner_dob = '1975-08-22';
policy2.owner_ssn_last4 = '5678';
policy2.owner_email = 'jane.doe@email.com';
policy2.owner_phone = '555-0456';
policy2.mailing_street1 = '456 Oak Avenue';
policy2.mailing_city = 'Los Angeles';
policy2.mailing_state = 'CA';
policy2.mailing_zip = '90001';
policy2.mailing_country = 'USA';
policy2.return_mail_flag = false;
policy2.insert();

// Create policy with return mail
var policy3 = new GlideRecord('x_dxcis_ins_pol_policy');
policy3.initialize();
policy3.policy_number = 'LIFE-2024-003';
policy3.policy_type = 'LIFE';
policy3.status = 'LAPSED';
policy3.product_name = 'Term Life 20';
policy3.issue_date = '2022-03-10';
policy3.effective_date = '2022-03-10';
policy3.face_amount = 250000;
policy3.premium_amount = 100;
policy3.premium_frequency = 'MONTHLY';
policy3.owner_first_name = 'Bob';
policy3.owner_last_name = 'Johnson';
policy3.owner_dob = '1985-11-05';
policy3.owner_ssn_last4 = '9012';
policy3.mailing_street1 = '789 Elm Street';
policy3.mailing_city = 'Chicago';
policy3.mailing_state = 'IL';
policy3.mailing_zip = '60601';
policy3.mailing_country = 'USA';
policy3.return_mail_flag = true;
policy3.return_mail_date = '2024-01-15';
policy3.return_mail_reason = 'Address unknown';
policy3.insert();

gs.info('Created 3 sample policies');
```

3. Click: **Run script**

**Option B: Via Import**

Create a CSV file and import via **System Import Sets**.

---

## 🎨 Accessing the Application

### In ServiceNow UI Builder

1. Navigate to: **All** → **UI Builder**
2. Click: **Experiences**
3. Find: **Policy Servicing**
4. Click: **Open**

### Direct URL

```
https://YOUR-INSTANCE.service-now.com/now/nav/ui/classic/params/target/x_dxcis_ins_pol
```

Replace `YOUR-INSTANCE` with your instance name.

---

## 🔒 Security Configuration

### Create Application Roles

```javascript
// Run in Scripts - Background

// Create user role
var role = new GlideRecord('sys_user_role');
role.name = 'x_dxcis_ins_pol.user';
role.description = 'Can view and search policies';
role.insert();

// Create admin role
var adminRole = new GlideRecord('sys_user_role');
adminRole.name = 'x_dxcis_ins_pol.admin';
adminRole.description = 'Full access to policy management';
adminRole.insert();
```

### Assign Roles to Users

1. Navigate to: **User Administration** → **Users**
2. Select user
3. Under **Roles** tab, add: `x_dxcis_ins_pol.user`

---

## 🔄 Updating Existing Deployment

### Quick Update (CLI)

```bash
npm run build && npm run deploy
```

### Incremental Update (IDE)

- Save files in VS Code
- Auto-syncs to ServiceNow

### Rollback

1. Navigate to: **System Update Sets** → **Local Update Sets**
2. Find your update set
3. Right-click → **Back out**

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Table exists: `x_dxcis_ins_pol_policy`
- [ ] Sample data loaded (at least 3 policies)
- [ ] UI Builder shows "Policy Servicing" experience
- [ ] Can access application via URL
- [ ] Policy Search loads and displays data
- [ ] Can click policy to view details
- [ ] No JavaScript errors in browser console

---

## 🐛 Common Issues

### Issue: "No Fluent App Found"

**Cause**: Using wrong repository (React version instead of SDK version)

**Solution**: This repo (workspace_SDK) IS the SDK version - it should work!

### Issue: "Authentication Failed" in CLI

**Solution**:
```bash
# Reconfigure profile
snc configure profile set --profile my-dev-instance

# Test connection
snc instance info
```

### Issue: "Table Not Found"

**Solution**:
```bash
# Force table creation
snc table create --definition src/tables/x_dxcis_ins_pol_policy.json
```

### Issue: "Instance Hibernated" (PDI)

**Solution**:
1. Go to https://developer.servicenow.com/
2. Click "My Instances"
3. Click "Wake Up Instance"
4. Wait 2-3 minutes

### Issue: Components Not Visible

**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check user has correct role
3. Verify application is activated:
   - Navigate to: **System Applications** → **Applications**
   - Find: **Insurance Policy Servicing**
   - Ensure **Active** is checked

---

## 📊 Deployment Environments

### Development
- Use PDI
- Deploy via: `npm run dev` (live reload)
- Iterate quickly

### QA/Testing
- Deploy via: Update Sets
- Import from Dev
- Test thoroughly

### Production
- Deploy via: Approved Update Sets
- Change management process
- Schedule during maintenance window

---

## 🚀 CI/CD Pipeline (Advanced)

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to ServiceNow

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Install ServiceNow CLI
        run: npm install -g @servicenow/cli

      - name: Configure ServiceNow
        run: |
          snc configure profile set \
            --profile ci-instance \
            --instance-url ${{ secrets.SN_INSTANCE_URL }} \
            --username ${{ secrets.SN_USERNAME }} \
            --password ${{ secrets.SN_PASSWORD }}

      - name: Build and Deploy
        run: |
          npm run build
          npm run deploy
```

---

## 📞 Support

- ServiceNow Developer Community: https://community.servicenow.com/
- ServiceNow Docs: https://docs.servicenow.com/
- This Project: Open an issue on GitHub

---

**Happy Deploying! 🎉**
