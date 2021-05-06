package firestoredb

import (
	"context"
	"encoding/json"
	"fmt"

	"cloud.google.com/go/firestore"
	models "github.com/ayoz4/go-next-web-app/app/models"
	"github.com/ayoz4/go-next-web-app/app/store"
	"github.com/mitchellh/mapstructure"
	"google.golang.org/api/iterator"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// GoodRepository ...
type GoodRepository struct {
	store *Store
}

// GetGoods is a method to read goods from db
func (r *GoodRepository) GetGoods(filter string) []*models.Good {
	// var result *firestore.DocumentIterator

	// if len(filter) > 0 {
	// 	result = r.store.client.Collection("goods").OrderBy(filter, firestore.Asc).Documents(context.Background())
	// } else {
	// 	result = r.store.client.Collection("goods").Documents(context.Background())
	// }

	result := filterBy(filter, r)

	goods := make([]*models.Good, 0)

	for {
		doc, err := result.Next()
		if err == iterator.Done {
			break
		}

		// g_1 := &models.Good{}

		// doc.DataTo(g_1)

		g := fromMapToStruct(doc.Data(), doc.Ref.ID)
		goods = append(goods, g)
	}

	return goods
}

// GetGood is a function to get a one good from db
func (r *GoodRepository) GetGood(id string) (*models.Good, error) {
	g := &models.Good{}
	result, err := r.store.client.Collection("goods").Doc(id).Get(context.Background())
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return nil, store.ErrDocNotFound
		}
		return nil, err
	}

	g = fromMapToStruct(result.Data(), result.Ref.ID)

	return g, nil
}

// CreateGood is amethod to create a good in Db
func (r *GoodRepository) CreateGood(g *models.Good) error {
	if err := g.Validate(); err != nil {
		return err
	}

	_, _, err := r.store.client.Collection("goods").Add(context.Background(), map[string]interface{}{
		"name":        g.Name,
		"description": g.Description,
		"price":       g.Price,
	})
	if err != nil {
		return err
	}

	return nil
}

// DeleteGood is a function to delete good from db
func (r *GoodRepository) DeleteGood(id string) error {
	_, err := r.store.client.Collection("goods").Doc(id).Delete(context.Background())
	if err != nil {
		return err
	}

	return nil
}

// UpdateGood is a function to update good in db
func (r *GoodRepository) UpdateGood(g *models.Good) error {
	_, err := r.store.client.Collection("goods").Doc(g.ID).Get(context.Background())
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return store.ErrDocNotFound
		}

		return err
	}

	// ng, err := compareDocs(doc.Data(), g)
	// if err != nil {
	// 	return err
	// }

	// ng := fromMapToStruct(doc.Data(), g.ID)

	i := &models.Image{
		Name: g.Image.Name,
		Url:  g.Image.Url,
	}

	fmt.Println(i)
	fmt.Println(g)

	_, err = r.store.client.Collection("goods").Doc(g.ID).Set(context.Background(), map[string]interface{}{
		"name":        g.Name,
		"description": g.Description,
		"price":       g.Price,
		// "image": models.Image{
		// 	Name: ng.Image.Name,
		// 	Url:  ng.Image.Url,
		// },
		"image": i,
	})
	if err != nil {
		return err
	}

	// _, err = r.store.client.Collection("goods").Doc(g.ID).Update(context.Background(), []firestore.Update{
	// 	{
	// 		FieldPath:
	// 	},
	// })
	// if err != nil {
	// 	fmt.Println(err)
	// }

	return nil
}

func fromMapToStruct(gm map[string]interface{}, id string) *models.Good {
	i := models.Image{}
	mapstructure.Decode(gm["image"], &i)

	// g := &models.Good{
	// 	ID:          id,
	// 	Name:        gm["name"].(string),
	// 	Description: gm["description"].(string),
	// 	Price:       int(gm["price"].(int64)),
	// }

	tg := &models.Good{
		ID:          id,
		Name:        gm["name"].(string),
		Description: gm["description"].(string),
		Price:       int(gm["price"].(int64)),
		Image:       i,
	}

	// g := &models.Good{}

	// mapstructure.Decode(gm, g)

	return tg
}

func compareDocs(doc map[string]interface{}, g *models.Good) (*models.Good, error) {
	var interf map[string]interface{}
	inrec, _ := json.Marshal(g)
	json.Unmarshal(inrec, &interf)

	fmt.Println(g)

	delete(interf, "id")

	for key, value := range interf {
		if value == "" {
			delete(interf, key)
			interf[key] = doc[key]
		}
	}

	fmt.Println("interf", interf)

	ng := &models.Good{}

	jsonMap, err := json.Marshal(interf)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(jsonMap, ng); err != nil {
		return nil, err
	}

	fmt.Println(ng)

	return ng, nil
}

func filterBy(f string, r *GoodRepository) *firestore.DocumentIterator {
	var result *firestore.DocumentIterator

	// switch f {
	// case "name":
	// 	result = r.store.client.Collection("goods").OrderBy(f, firestore.Asc).Documents(context.Background())

	// case "price":
	// 	result = r.store.client.Collection("goods").OrderBy(f, firestore.Asc).Documents(context.Background())
	// }

	if len(f) > 0 {
		result = r.store.client.Collection("goods").OrderBy(f, firestore.Asc).Documents(context.Background())
	} else {
		result = r.store.client.Collection("goods").Documents(context.Background())
	}

	return result
}

// func (x *int) {

// }
