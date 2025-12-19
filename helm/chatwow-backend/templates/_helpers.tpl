{{/*
Expand the name of the chart.
*/}}
{{- define "chatwow-backend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "chatwow-backend.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "chatwow-backend.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "chatwow-backend.labels" -}}
helm.sh/chart: {{ include "chatwow-backend.chart" . }}
{{ include "chatwow-backend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "chatwow-backend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "chatwow-backend.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "chatwow-backend.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "chatwow-backend.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Worker section
*/}}
{{- define "chatwow-worker.fullname" -}}
chatwow-worker
{{- end }}
{{- define "chatwow-worker.labels" -}}
helm.sh/chart: {{ include "chatwow-backend.chart" . }}
{{ include "chatwow-worker.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "chatwow-worker.selectorLabels" -}}
app.kubernetes.io/name: {{ include "chatwow-backend.name" . }}-worker
app.kubernetes.io/instance: {{ .Release.Name }}-worker

component: worker
{{- end }}
{{- define "chatwow-worker.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "chatwow-worker.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Cron section
*/}}
{{- define "chatwow-cron.fullname" -}}
chatwow-cron
{{- end }}
{{- define "chatwow-cron.labels" -}}
helm.sh/chart: {{ include "chatwow-backend.chart" . }}
{{ include "chatwow-cron.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "chatwow-cron.selectorLabels" -}}
app.kubernetes.io/name: {{ include "chatwow-backend.name" . }}-cron
app.kubernetes.io/instance: {{ .Release.Name }}-cron

component: cron
{{- end }}
{{- define "chatwow-cron.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "chatwow-cron.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
