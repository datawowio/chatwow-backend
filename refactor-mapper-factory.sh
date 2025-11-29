#!/usr/bin/env bash
# Script to refactor Mapper and Factory classes to functions
# Following the pattern from src/domain/base/user/**

set -e

# List of domains to refactor (excluding 'user' which is already done)
DOMAINS=(
  "line-bot"
  "line-account"
  "line-session"
  "line-chat-log"
  "password-reset-token"
  "session"
  "user-verification"
  "audit-log"
  "project"
  "project-chat"
  "project-document"
  "stored-file"
  "user-group"
  "user-group-project"
  "user-group-user"
  "user-manage-project"
)

BASE_DIR="src/domain/base"

# Function to convert PascalCase to camelCase
to_camel_case() {
  local input=$1
  echo "$input" | sed 's/^./\L&/'
}

# Function to convert kebab-case to PascalCase
to_pascal_case() {
  local input=$1
  echo "$input" | sed -E 's/(^|-)([a-z])/\U\2/g'
}

echo "Starting refactoring..."

for domain in "${DOMAINS[@]}"; do
  echo "Processing domain: $domain"
  
  DOMAIN_DIR="$BASE_DIR/$domain"
  DOMAIN_PASCAL=$(to_pascal_case "$domain")
  DOMAIN_CAMEL=$(to_camel_case "$DOMAIN_PASCAL")
  
  MAPPER_CLASS="${DOMAIN_PASCAL}Mapper"
  FACTORY_CLASS="${DOMAIN_PASCAL}Factory"
  
  # Process all TypeScript files in the domain
  find "$DOMAIN_DIR" -name "*.ts" -type f | while read -r file; do
    if [[ -f "$file" ]]; then
      # Replace Mapper class methods with functions
      sed -i '' "s/${MAPPER_CLASS}\.fromPg/${DOMAIN_CAMEL}FromPg/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.fromPgWithState/${DOMAIN_CAMEL}FromPgWithState/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.fromPlain/${DOMAIN_CAMEL}FromPlain/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.fromJson/${DOMAIN_CAMEL}FromJson/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.fromJsonWithState/${DOMAIN_CAMEL}FromJsonWithState/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.toPg/${DOMAIN_CAMEL}ToPg/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.toPlain/${DOMAIN_CAMEL}ToPlain/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.toJson/${DOMAIN_CAMEL}ToJson/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.toJsonWithState/${DOMAIN_CAMEL}ToJsonWithState/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.toResponse/${DOMAIN_CAMEL}ToResponse/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.pgToResponse/${DOMAIN_CAMEL}PgToResponse/g" "$file"
      
      # Replace Factory class methods with functions
      sed -i '' "s/${FACTORY_CLASS}\.new/new${DOMAIN_PASCAL}/g" "$file"
      sed -i '' "s/${FACTORY_CLASS}\.mock/mock${DOMAIN_PASCAL}/g" "$file"
      sed -i '' "s/${FACTORY_CLASS}\.mockBulk/mock${DOMAIN_PASCAL}s/g" "$file"
    fi
  done
  
  # Process files outside the domain directory that might reference this domain
  find src/app src/domain/orchestration -name "*.ts" -type f | while read -r file; do
    if [[ -f "$file" ]]; then
      # Replace Mapper class methods
      sed -i '' "s/${MAPPER_CLASS}\.fromPg/${DOMAIN_CAMEL}FromPg/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.fromPgWithState/${DOMAIN_CAMEL}FromPgWithState/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.fromPlain/${DOMAIN_CAMEL}FromPlain/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.fromJson/${DOMAIN_CAMEL}FromJson/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.fromJsonWithState/${DOMAIN_CAMEL}FromJsonWithState/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.toPg/${DOMAIN_CAMEL}ToPg/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.toPlain/${DOMAIN_CAMEL}ToPlain/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.toJson/${DOMAIN_CAMEL}ToJson/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.toJsonWithState/${DOMAIN_CAMEL}ToJsonWithState/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.toResponse/${DOMAIN_CAMEL}ToResponse/g" "$file"
      sed -i '' "s/${MAPPER_CLASS}\.pgToResponse/${DOMAIN_CAMEL}PgToResponse/g" "$file"
      
      # Replace Factory class methods
      sed -i '' "s/${FACTORY_CLASS}\.new/new${DOMAIN_PASCAL}/g" "$file"
      sed -i '' "s/${FACTORY_CLASS}\.mock/mock${DOMAIN_PASCAL}/g" "$file"
      sed -i '' "s/${FACTORY_CLASS}\.mockBulk/mock${DOMAIN_PASCAL}s/g" "$file"
    fi
  done
  
  echo "  ✓ Updated usages for $domain"
done

echo "✅ Refactoring complete!"
echo "Note: You still need to manually convert the class definitions to function exports in mapper and factory files."
