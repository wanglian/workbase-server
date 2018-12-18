# Meteor Files

https://github.com/VeliovGroup/Meteor-Files/wiki

## 上传进度

```
{{#with currentUpload}}
  {{> spinner}}
{{/with}}

{{#with currentUpload}}
  <div class="progress progress-sm active">
    <div class="progress-bar progress-bar-primary progress-bar-striped" role="progressbar" aria-valuenow="{{progress.get}}" aria-valuemin="0" aria-valuemax="100" style="width: {{progress.get}}%">
      <span class="sr-only">Uploading {{progress.get}}% Complete</span>
    </div>
  </div>
{{/with}}
```

## docker部署

https://github.com/VeliovGroup/Meteor-Files/wiki/MeteorUp-(MUP)-Usage

需要映射路径？

## S3集成

https://github.com/VeliovGroup/Meteor-Files/wiki/AWS-S3-Integration

### S3 - 创建bucket
- name: weaworking.com
- region: ca-central-1

S3 region list: https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region

### IAM - 创建policy
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:GetObjectAcl",
                "s3:DeleteObject"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::BUCKETNAME",
                "arn:aws:s3:::BUCKETNAME/*"
            ]
        }
    ]
}
```

### IAM - 创建用户
- name
- Programmatic access
- policy
- Access Key:
- Secret access key:

