# AWS AMI Selection Guide for Portfolio Deployment

## Overview
This guide helps you find the appropriate Amazon Machine Image (AMI) for deploying your portfolio website with Docker support across different AWS regions.

## Current AMI Configuration
The CloudFormation template currently uses:
- **AMI ID**: `ami-0c02fb55956c7d316`
- **Description**: Amazon Linux 2023 AMI (x86_64)
- **Region**: US East (N. Virginia) - us-east-1

## Finding the Right AMI

### Method 1: AWS Management Console
1. **Navigate to EC2 Dashboard**
   - Go to AWS Console → EC2 → AMIs
   - Select "Public images" from the dropdown

2. **Search Criteria**
   - **Owner**: Amazon
   - **Name**: `amzn2023-ami-*`
   - **Architecture**: x86_64
   - **Virtualization**: hvm
   - **Root device type**: ebs

3. **Filter Results**
   - Sort by "Creation date" (newest first)
   - Look for the most recent Amazon Linux 2023 AMI

### Method 2: AWS CLI
```bash
# Find latest Amazon Linux 2023 AMI in your region
aws ec2 describe-images \
    --owners amazon \
    --filters \
        "Name=name,Values=amzn2023-ami-*" \
        "Name=architecture,Values=x86_64" \
        "Name=virtualization-type,Values=hvm" \
        "Name=root-device-type,Values=ebs" \
    --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId' \
    --output text
```

### Method 3: AWS Systems Manager Parameter Store
```bash
# Get the latest Amazon Linux 2023 AMI ID
aws ssm get-parameters \
    --names /aws/service/ami-amazon-linux-latest/amzn2023-ami-kernel-6.1-x86_64 \
    --query 'Parameters[0].Value' \
    --output text
```

## Region-Specific AMI IDs

### Popular AWS Regions
| Region | Region Code | Amazon Linux 2023 AMI ID |
|--------|-------------|---------------------------|
| US East (N. Virginia) | us-east-1 | ami-0c02fb55956c7d316 |
| US East (Ohio) | us-east-2 | ami-0ea3c35c5c3284d82 |
| US West (Oregon) | us-west-2 | ami-008fe2fc65df48dac |
| US West (N. California) | us-west-1 | ami-0d53d72369335a9d6 |
| Europe (Ireland) | eu-west-1 | ami-0905a3c97561e0b69 |
| Europe (London) | eu-west-2 | ami-0fb391cce7a602d1f |
| Europe (Frankfurt) | eu-central-1 | ami-0faab6bdbac9486fb |
| Asia Pacific (Mumbai) | ap-south-1 | ami-0f5ee92e2d63afc18 |
| Asia Pacific (Singapore) | ap-southeast-1 | ami-0df7a207adb9748c7 |
| Asia Pacific (Sydney) | ap-southeast-2 | ami-0310483fb2b488153 |
| Asia Pacific (Tokyo) | ap-northeast-1 | ami-0d52744d6551d851e |

> **Note**: AMI IDs change frequently as AWS releases updates. Always verify the latest AMI ID before deployment.

## Recommended AMI Selection Criteria

### For Production Deployment
1. **Amazon Linux 2023** (Recommended)
   - Latest security patches
   - Optimized for AWS
   - Built-in Docker support
   - Long-term support

2. **Ubuntu Server 22.04 LTS**
   - Alternative option
   - Wide community support
   - Docker pre-installed in some variants

### For Development/Testing
1. **Amazon Linux 2023** (Same as production)
2. **Ubuntu Server 20.04 LTS** (Older but stable)

## Updating CloudFormation Template

### Option 1: Hardcoded AMI ID
```yaml
Resources:
  WebServerInstance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0c02fb55956c7d316  # Update this ID
```

### Option 2: Parameter-based AMI Selection
```yaml
Parameters:
  LatestAmiId:
    Type: AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>
    Default: /aws/service/ami-amazon-linux-latest/amzn2023-ami-kernel-6.1-x86_64

Resources:
  WebServerInstance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: !Ref LatestAmiId
```

### Option 3: Mapping-based Regional AMIs
```yaml
Mappings:
  RegionMap:
    us-east-1:
      AMI: ami-0c02fb55956c7d316
    us-east-2:
      AMI: ami-0ea3c35c5c3284d82
    us-west-2:
      AMI: ami-008fe2fc65df48dac
    ap-south-1:
      AMI: ami-0f5ee92e2d63afc18

Resources:
  WebServerInstance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: !FindInMap [RegionMap, !Ref "AWS::Region", AMI]
```

## Verification Steps

### After Finding an AMI
1. **Check AMI Details**
   ```bash
   aws ec2 describe-images --image-ids ami-xxxxxxxxx
   ```

2. **Verify Docker Support**
   - Launch a test instance
   - SSH into the instance
   - Run: `docker --version`

3. **Test Application Deployment**
   - Deploy your Docker containers
   - Verify all services start correctly

## Troubleshooting Common Issues

### AMI Not Found Error
- **Cause**: AMI ID doesn't exist in the target region
- **Solution**: Use region-specific AMI ID or parameter store method

### Docker Not Available
- **Cause**: AMI doesn't have Docker pre-installed
- **Solution**: Add Docker installation to UserData script

### Permission Issues
- **Cause**: User doesn't have permission to use AMI
- **Solution**: Use public AMIs or check IAM permissions

## Best Practices

1. **Always Use Latest AMIs**
   - Regular security updates
   - Latest features and bug fixes

2. **Test Before Production**
   - Deploy to staging environment first
   - Verify all components work correctly

3. **Document AMI Choices**
   - Keep track of AMI IDs used
   - Document any customizations made

4. **Automate AMI Updates**
   - Use parameter store for dynamic AMI selection
   - Set up automated testing pipeline

## Quick Commands Reference

```bash
# Find current region
aws configure get region

# List all available regions
aws ec2 describe-regions --query 'Regions[].RegionName' --output table

# Get latest Amazon Linux 2023 AMI for current region
aws ssm get-parameters \
    --names /aws/service/ami-amazon-linux-latest/amzn2023-ami-kernel-6.1-x86_64 \
    --query 'Parameters[0].Value' \
    --output text

# Describe specific AMI
aws ec2 describe-images --image-ids ami-xxxxxxxxx --output table
```

## Additional Resources

- [AWS AMI Documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html)
- [Amazon Linux 2023 User Guide](https://docs.aws.amazon.com/linux/al2023/ug/)
- [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-public-parameters-ami.html)
- [Docker on Amazon Linux](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html)
