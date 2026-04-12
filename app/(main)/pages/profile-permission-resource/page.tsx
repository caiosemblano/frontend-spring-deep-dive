/* eslint-disable @next/next/no-img-element */
'use client';
import { ProfilePermissionResourceService } from '@/service/ProfilePermissionResourceService';
import { ProfileService } from '@/service/ProfileService';
import { ResourceService } from '@/service/ResourceService';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';

const ProfilePermissionResource = () => {
    let emptyProfilePermissionResource: Project.ProfilePermissionResource = {
        id: 0,
        profile: {
            id: 0,
            description: ''
        },
        resource: {
            id: 0,
            name: '',
            key: ''
        },
        permission: ''
    };

    const [profilePermissionResources, setProfilePermissionResources] = useState<Project.ProfilePermissionResource[]>([]);
    const [profiles, setProfiles] = useState<Project.Profile[]>([]);
    const [resources, setResources] = useState<Project.Resource[]>([]);
    const [profilePermissionResourceDialog, setProfilePermissionResourceDialog] = useState(false);
    const [deleteProfilePermissionResourceDialog, setDeleteProfilePermissionResourceDialog] = useState(false);
    const [deleteProfilePermissionResourcesDialog, setDeleteProfilePermissionResourcesDialog] = useState(false);
    const [profilePermissionResource, setProfilePermissionResource] = useState<Project.ProfilePermissionResource>(emptyProfilePermissionResource);
    const [selectedProfilePermissionResources, setSelectedProfilePermissionResources] = useState<Project.ProfilePermissionResource[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const profilePermissionResourceService = new ProfilePermissionResourceService();
    const profileService = new ProfileService();
    const resourceService = new ResourceService();

    useEffect(() => {
        if (profilePermissionResources.length === 0) {
            profilePermissionResourceService.listAll()
                .then((response) => {
                    setProfilePermissionResources(response.data)
                }).catch((error) => {
                    console.log(error)
                });
        }
    }, [profilePermissionResource, profilePermissionResources.length]);

    useEffect(() => {
        profileService.listAll().then((response) => setProfiles(response.data)).catch(console.log);
        resourceService.listAll().then((response) => setResources(response.data)).catch(console.log);
    }, []);

    const openNew = () => {
        setProfilePermissionResource(emptyProfilePermissionResource);
        setSubmitted(false);
        setProfilePermissionResourceDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProfilePermissionResourceDialog(false);
    };

    const hideDeleteProfilePermissionResourceDialog = () => {
        setDeleteProfilePermissionResourceDialog(false);
    };

    const hideDeleteProfilePermissionResourcesDialog = () => {
        setDeleteProfilePermissionResourcesDialog(false);
    };

    const saveProfilePermissionResource = () => {
        setSubmitted(true);

        if (!profilePermissionResource.id) {
            profilePermissionResourceService.insert(profilePermissionResource)
                .then((response) => {
                    setProfilePermissionResourceDialog(false);
                    setProfilePermissionResource(emptyProfilePermissionResource);
                    setProfilePermissionResources([]); // reload list
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Info',
                        detail: 'Profile Permission Resource registered successfully'
                    })
                }).catch((error) => {
                    const errorMessage = error?.response?.data?.message || error?.message || "Unknown error";
                    console.log(errorMessage)
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error!',
                        detail: 'Error while registering: ' + errorMessage
                    })
                })
        } else {
            profilePermissionResourceService.update(profilePermissionResource)
                .then((response) => {
                    setProfilePermissionResourceDialog(false)
                    setProfilePermissionResource(emptyProfilePermissionResource)
                    setProfilePermissionResources([]); // reload list
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Info',
                        detail: 'Profile Permission Resource updated successfully'
                    })
                }).catch((error) => {
                    const errorMessage = error?.response?.data?.message || error?.message || "Unknown error";
                    console.log(errorMessage)
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error!',
                        detail: 'Error while updating: ' + errorMessage
                    })
                })
        }
    };

    const editProfilePermissionResource = (profilePermissionResource: Project.ProfilePermissionResource) => {
        setProfilePermissionResource({ ...profilePermissionResource });
        setProfilePermissionResourceDialog(true);
    };

    const confirmDeleteProfilePermissionResource = (profilePermissionResource: Project.ProfilePermissionResource) => {
        setProfilePermissionResource(profilePermissionResource);
        setDeleteProfilePermissionResourceDialog(true);
    };

    const deleteProfilePermissionResource = () => {
        if (!profilePermissionResource.id) return;

        profilePermissionResourceService.delete(profilePermissionResource.id)
            .then((response) => {
                setProfilePermissionResource(emptyProfilePermissionResource);
                setDeleteProfilePermissionResourceDialog(false);
                setProfilePermissionResources([]); // reload list
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Profile Permission Resource Deleted',
                    life: 3000
                });
            }).catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error while deleting Profile Permission Resource',
                    life: 3000
                });
            })
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProfilePermissionResourcesDialog(true);
    };

    const deleteSelectedProfilePermissionResources = () => {
        Promise.all(selectedProfilePermissionResources.map(async (_item) => {
            if (_item.id) {
                return await profilePermissionResourceService.delete(_item.id);
            }
        })).then((response) => {
            setProfilePermissionResources([]); // reload list
            setSelectedProfilePermissionResources([]);
            setDeleteProfilePermissionResourcesDialog(false);
            setProfilePermissionResource(emptyProfilePermissionResource);
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Profile Permission Resources Deleted',
                life: 3000
            });
        }).catch((error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error while deleting Profile Permission Resources',
                life: 3000
            })
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _obj = { ...profilePermissionResource };
        (_obj as any)[name] = val;

        setProfilePermissionResource(_obj);
    };

    const onSelectChange = (e: any, name: string) => {
        const val = e.value;
        let _obj = { ...profilePermissionResource };
        (_obj as any)[name] = val;

        setProfilePermissionResource(_obj);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProfilePermissionResources || !(selectedProfilePermissionResources as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Project.ProfilePermissionResource) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
        );
    };

    const profileBodyTemplate = (rowData: Project.ProfilePermissionResource) => {
        return (
            <>
                <span className="p-column-title">Profile</span>
                {rowData.profile?.description}
            </>
        );
    };

    const resourceBodyTemplate = (rowData: Project.ProfilePermissionResource) => {
        return (
            <>
                <span className="p-column-title">Resource</span>
                {rowData.resource?.name}
            </>
        );
    };
    
    const permissionBodyTemplate = (rowData: Project.ProfilePermissionResource) => {
        return (
            <>
                <span className="p-column-title">Permission</span>
                {rowData.permission}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Project.ProfilePermissionResource) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProfilePermissionResource(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProfilePermissionResource(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Profile Permissions Resources</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const profilePermissionResourceDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProfilePermissionResource} />
        </>
    );

    const deleteProfilePermissionResourceDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProfilePermissionResourceDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProfilePermissionResource} />
        </>
    );

    const deleteProfilePermissionResourcesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProfilePermissionResourcesDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedProfilePermissionResources} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={profilePermissionResources}
                        selection={selectedProfilePermissionResources}
                        onSelectionChange={(e) => setSelectedProfilePermissionResources(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        globalFilter={globalFilter}
                        emptyMessage="No permissions found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Code" sortable body={idBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="profile.description" header="Profile" sortable body={profileBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="resource.name" header="Resource" sortable body={resourceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="permission" header="Permission" sortable body={permissionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={profilePermissionResourceDialog} style={{ width: '450px' }} header="Profile Permission Details" modal className="p-fluid" footer={profilePermissionResourceDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="profile">Profile</label>
                            <Dropdown
                                id="profile"
                                value={profilePermissionResource.profile}
                                onChange={(e) => onSelectChange(e, 'profile')}
                                options={profiles}
                                optionLabel="description"
                                placeholder="Select a Profile"
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && (!profilePermissionResource.profile || !profilePermissionResource.profile.id)
                                })}
                            />
                            {submitted && (!profilePermissionResource.profile || !profilePermissionResource.profile.id) && <small className="p-invalid">Profile is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="resource">Resource</label>
                            <Dropdown
                                id="resource"
                                value={profilePermissionResource.resource}
                                onChange={(e) => onSelectChange(e, 'resource')}
                                options={resources}
                                optionLabel="name"
                                placeholder="Select a Resource"
                                required
                                className={classNames({
                                    'p-invalid': submitted && (!profilePermissionResource.resource || !profilePermissionResource.resource.id)
                                })}
                            />
                            {submitted && (!profilePermissionResource.resource || !profilePermissionResource.resource.id) && <small className="p-invalid">Resource is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="permission">Permission</label>
                            <InputText
                                id="permission"
                                value={profilePermissionResource.permission}
                                onChange={(e) => onInputChange(e, 'permission')}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !profilePermissionResource.permission
                                })}
                            />
                            {submitted && !profilePermissionResource.permission && <small className="p-invalid">Permission is required.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProfilePermissionResourceDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfilePermissionResourceDialogFooter} onHide={hideDeleteProfilePermissionResourceDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {profilePermissionResource && (
                                <span>
                                    Are you sure you want to delete permission for <b>{profilePermissionResource.profile?.description}</b> in <b>{profilePermissionResource.resource?.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProfilePermissionResourcesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfilePermissionResourcesDialogFooter} onHide={hideDeleteProfilePermissionResourcesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {profilePermissionResource && <span>Are you sure you want to delete the selected permissions?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ProfilePermissionResource;
