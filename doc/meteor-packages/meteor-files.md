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