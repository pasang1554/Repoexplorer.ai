import os
from git import Repo
from app.core.config import settings
from app.core.logging import logger

class GitHubService:
    def clone_repo(self, repo_url: str) -> str:
        """Clones a GitHub repository to a local directory and returns the path."""
        repo_name = repo_url.rstrip('/').split('/')[-1]
        if repo_name.endswith('.git'):
            repo_name = repo_name[:-4]
            
        local_path = os.path.join(settings.REPOS_DIR, repo_name)
        
        # Ensure base directory exists
        os.makedirs(settings.REPOS_DIR, exist_ok=True)
        
        if os.path.exists(local_path):
            logger.info(f"Repository {repo_name} already exists. Reusing local clone.")
            return local_path
            
        logger.info(f"Cloning {repo_url} into {local_path}...")
        Repo.clone_from(repo_url, local_path)
        logger.info(f"Successfully cloned {repo_name}.")
        
        return local_path
