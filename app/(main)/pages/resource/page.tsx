/* eslint-disable @next/next/no-img-element */
'use client';
import { ResourceService } from '@/service/ResourceService';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';

const Resource = () => {
    let emptyResource: Project.Resource = {
        id: 0,
        name: '',
        key: ''
    };

    const [resources, setResources] = useState<Project.Resource[]>([]);
    const [resourceDialog, setResourceDialog] = useState(false);
    const [deleteResourceDialog, setDeleteResourceDialog] = useState(false);
    const [deleteResourcesDialog, setDeleteResourcesDialog] = useState(false);
    const [resource, setResource] = useState<Project.Resource>(emptyResource);
    const [selectedResources, setSelectedResources] = useState<Project.Resource[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const resourceService = new ResourceService();

    useEffect(() => {
        if (resources.length == 0) {
            resourceService.listAll()
                .then((response) => {
                    console.log(response.data)
                    setResources(response.data)
                }).catch((error) => {
                    console.log(error)
                });
        }
    }, [resource]);

    const openNew = () => {
        setResource(emptyResource);
        setSubmitted(false);
        setResourceDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setResourceDialog(false);
    };

    const hideDeleteResourceDialog = () => {
        setDeleteResourceDialog(false);
    };

    const hideDeleteResourcesDialog = () => {
        setDeleteResourcesDialog(false);
    };

    const saveResource = () => {
        setSubmitted(true);

        if (!resource.id) {
            resourceService.insert(resource)
                .then((response) => {
                    setResourceDialog(false);
                    setResource(emptyResource);
                    setResources([]);
                    setResources(response.data);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Info',
                        detail: 'Resource registred successfully'
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
            resourceService.update(resource)
                .then((response) => {
                    setResourceDialog(false)
                    setResource(emptyResource)
                    setResources([]);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Info',
                        detail: 'Resource updated successfully'
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

    const editResource = (resource: Project.Resource) => {
        setResource({ ...resource });
        setResourceDialog(true);
    };

    const confirmDeleteResource = (resource: Project.Resource) => {
        setResource(resource);
        setDeleteResourceDialog(true);
    };

    const deleteResource = () => {
        if (!resource.id) return;

        resourceService.delete(resource.id)
            .then((response) => {
                setResource(emptyResource);
                setDeleteResourceDialog(false);
                setResources([]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Resource Deleted',
                    life: 3000
                });
            }).catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error while deleting resource',
                    life: 3000
                });
            })
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (resources as any)?.length; i++) {
            if ((resources as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteResourcesDialog(true);
    };

    const deleteSelectedResources = () => {
        Promise.all(selectedResources.map(async (_resource) => {
            if (_resource.id) {
                return await resourceService.delete(_resource.id);
            }
        })).then((response) => {
            setResources([]);
            setSelectedResources([]);
            setDeleteResourcesDialog(false);
            setResource(emptyResource); // Gatilho para o useEffect recarregar a lista
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Resources Deleted',
                life: 3000
            });
        }).catch((error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error while deleting resources',
                life: 3000
            })
        });
    };


    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _resource = { ...resource };
        (_resource as any)[name] = val;

        setResource(_resource);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedResources || !(selectedResources as any).length} />
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

    const idBodyTemplate = (rowData: Project.Resource) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Project.Resource) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const keyBodyTemplate = (rowData: Project.Resource) => {
        return (
            <>
                <span className="p-column-title">Key</span>
                {rowData.key}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Project.Resource) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editResource(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteResource(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Resources</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const resourceDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveResource} />
        </>
    );
    const deleteResourceDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteResourceDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteResource} />
        </>
    );
    const deleteResourcesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteResourcesDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedResources} />
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
                        value={resources}
                        selection={selectedResources}
                        onSelectionChange={(e) => setSelectedResources(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} resources"
                        globalFilter={globalFilter}
                        emptyMessage="No resources found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Code" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="key" header="Key" sortable body={keyBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={resourceDialog} style={{ width: '450px' }} header="Resource Details" modal className="p-fluid" footer={resourceDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={resource.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !resource.name
                                })}
                            />
                            {submitted && !resource.name && <small className="p-invalid">Name is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="key">Key</label>
                            <InputText
                                id="key"
                                value={resource.key}
                                onChange={(e) => onInputChange(e, 'key')}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !resource.key
                                })}
                            />
                            {submitted && !resource.key && <small className="p-invalid">Key is required.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteResourceDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteResourceDialogFooter} onHide={hideDeleteResourceDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {resource && (
                                <span>
                                    Are you sure you want to delete the resource <b>{resource.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteResourcesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteResourcesDialogFooter} onHide={hideDeleteResourcesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {resource && <span>Are you sure you want to delete the selected resources?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Resource;
