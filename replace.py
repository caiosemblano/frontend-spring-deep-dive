import codecs

# 1. Update BaseService
base_service_path = 'service/BaseService.tsx'
with codecs.open(base_service_path, 'r', 'utf-8') as f:
    base_text = f.read()

base_text = base_text.replace('listAllUsers(', 'listAll(')
base_text = base_text.replace('insertUser(', 'insert(')
base_text = base_text.replace('updateUser(', 'update(')
base_text = base_text.replace('deleteUser(', 'delete(')

with codecs.open(base_service_path, 'w', 'utf-8') as f:
    f.write(base_text)

# 2. Update user/page.tsx
user_page_path = 'app/(main)/pages/user/page.tsx'
with codecs.open(user_page_path, 'r', 'utf-8') as f:
    user_text = f.read()

user_text = user_text.replace('userService.listAllUsers(', 'userService.listAll(')
user_text = user_text.replace('userService.insertUser(', 'userService.insert(')
user_text = user_text.replace('userService.updateUser(', 'userService.update(')
user_text = user_text.replace('userService.deleteUser(', 'userService.delete(')

with codecs.open(user_page_path, 'w', 'utf-8') as f:
    f.write(user_text)

# 3. Update resource/page.tsx
res_page_path = 'app/(main)/pages/resource/page.tsx'
with codecs.open(res_page_path, 'r', 'utf-8') as f:
    res_text = f.read()

# Naive rename requested by user
res_text = res_text.replace('Users', 'Resources')
res_text = res_text.replace('User', 'Resource')
res_text = res_text.replace('users', 'resources')
res_text = res_text.replace('user', 'resource')

# Fix method calls to match the newly refactored BaseService
res_text = res_text.replace('resourceService.listAllResources(', 'resourceService.listAll(')
res_text = res_text.replace('resourceService.insertResource(', 'resourceService.insert(')
res_text = res_text.replace('resourceService.updateResource(', 'resourceService.update(')
res_text = res_text.replace('resourceService.deleteResource(', 'resourceService.delete(')
res_text = res_text.replace('resourceService.searchById(', 'resourceService.searchById(') # Not needed

with codecs.open(res_page_path, 'w', 'utf-8') as f:
    f.write(res_text)

