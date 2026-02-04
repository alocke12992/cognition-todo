import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import { Octokit } from '@octokit/rest';

// Load environment variables
config();

interface Issue {
  title: string;
  labels: string[];
  body: string;
}

async function createGitHubIssues() {
  // Validate environment variables
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'alocke12992';
  const repo = process.env.GITHUB_REPO || 'cognition-todo';

  if (!token) {
    console.error('❌ Error: GITHUB_ACCESS_TOKEN is not set in .env file');
    console.log('\nPlease create a .env file with your GitHub token:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Create a token at https://github.com/settings/tokens');
    console.log('3. Add the token to .env file');
    process.exit(1);
  }

  // Initialize Octokit
  const octokit = new Octokit({ auth: token });

  // Read issues from JSON file
  const issuesPath = join(__dirname, '../sampleIssues.json');
  let issues: Issue[];

  try {
    const issuesData = readFileSync(issuesPath, 'utf-8');
    issues = JSON.parse(issuesData);
    console.log(`📖 Read ${issues.length} issues from sampleIssues.json\n`);
  } catch (error) {
    console.error('❌ Error reading sampleIssues.json:', error);
    process.exit(1);
  }

  // Create issues
  console.log(`🚀 Creating issues in ${owner}/${repo}...\n`);
  let successCount = 0;
  let failCount = 0;

  for (const [index, issue] of issues.entries()) {
    try {
      const response = await octokit.issues.create({
        owner,
        repo,
        title: issue.title,
        body: issue.body,
        labels: issue.labels
      });

      console.log(`✅ [${index + 1}/${issues.length}] Created: "${issue.title}"`);
      console.log(`   URL: ${response.data.html_url}`);
      successCount++;

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(`❌ [${index + 1}/${issues.length}] Failed: "${issue.title}"`);
      if (error.response) {
        console.error(`   Status: ${error.response.status}`);
        console.error(`   Message: ${error.response.data.message}`);
      } else {
        console.error(`   Error: ${error.message}`);
      }
      failCount++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Summary:`);
  console.log(`   ✅ Successfully created: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📝 Total: ${issues.length}`);
  console.log('='.repeat(50));

  if (failCount > 0) {
    process.exit(1);
  }
}

// Run the script
createGitHubIssues().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
